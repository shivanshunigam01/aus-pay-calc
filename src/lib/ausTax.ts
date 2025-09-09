// /lib/ausTax.ts
// AUSTRALIA-ONLY CALCULATOR (AUD, ATO rules)

import { toAnnual } from "./money";

/* ========= Types ========= */

export type TaxYear = "2024-25" | "2025-26";
export type Residency = "resident" | "non_resident";
export type MedicareReduction = "none" | "half" | "full";
export type FamilyStatus = "single" | "family";

export interface CalculationInputs {
  salary: number; // value as typed
  frequency: "weekly" | "monthly" | "annually";
  includesSuper: boolean; // if true, salary is package (base + super)
  superRate: number; // % e.g. 12
  year: TaxYear; // default '2025-26'
  residency: Residency; // resident / non_resident
  claimTaxFreeThreshold: boolean; // resident only
  isSecondJob: boolean; // if true => no TFT
  onWorkingHolidayVisa: boolean; // WHM bracket set
  hasHELP: boolean; // student loan
  hasStudentLoanDebt?: boolean; // (alias; tolerated)
  hasPrivateHealth: boolean; // MLS applies if false
  medicareReduction: MedicareReduction; // none|half|full
  familyStatus: FamilyStatus; // single|family
  numberOfDependants: number; // for family MLS thresholds
  eligibleForSAPTO: boolean; // hook (0 by default)
}

export interface AnnualBreakdown {
  baseIncome: number; // annual, excludes employer super
  employerSuper: number; // annual
  taxableIncome: number; // annual (no deductions here)
  incomeTax: number;
  medicareLevy: number;
  mls: number; // surcharge
  help: number;
  sapto: number; // offsets reduce tax (kept 0 by default)
  taxOffsets: number; // other offsets (kept 0 by default)
  totalTax: number; // incomeTax + ML + MLS + HELP - offsets
  takeHome: number; // baseIncome - totalTax
  marginalTaxRate: number; // 0.30 -> 30%
}

/* ========= Constants (FY25-26 defaults) ========= */

// Stage-3 RESIDENT brackets (from 1 Jul 2024)
const RESIDENT_2526 = [
  { upTo: 18_200, base: 0, rate: 0, over: 0 },
  { upTo: 45_000, base: 0, rate: 0.16, over: 18_200 },
  { upTo: 135_000, base: 4_288, rate: 0.3, over: 45_000 },
  { upTo: 190_000, base: 31_288, rate: 0.37, over: 135_000 },
  { upTo: Infinity, base: 51_638, rate: 0.45, over: 190_000 },
];

// NON-RESIDENT (no TFT)
const NONRES_2526 = [
  { upTo: 135_000, base: 0, rate: 0.3, over: 0 },
  { upTo: 190_000, base: 40_500, rate: 0.37, over: 135_000 },
  { upTo: Infinity, base: 61_950, rate: 0.45, over: 190_000 },
];

// Working Holiday Maker brackets (unchanged by Stage-3)
const WHM = [
  { upTo: 45_000, base: 0, rate: 0.15, over: 0 },
  { upTo: 120_000, base: 6_750, rate: 0.325, over: 45_000 },
  { upTo: 180_000, base: 31_125, rate: 0.37, over: 120_000 },
  { upTo: Infinity, base: 53_325, rate: 0.45, over: 180_000 },
];

// Medicare Levy
const ML_RATE = 0.02; // 2%

// MLS – Singles tiers (Family thresholds below)
const MLS_SINGLE = [
  { upTo: 97_000, rate: 0.0 },
  { upTo: 113_000, rate: 0.01 },
  { upTo: 151_000, rate: 0.0125 },
  { upTo: Infinity, rate: 0.015 },
];

// Family base thresholds (approx. = 2x single). Add $1,500 per dependent child.
const MLS_FAMILY_BASE = { tier0: 194_000, tier1: 226_000, tier2: 302_000 };
const MLS_DEP_INC = 1_500;

// HELP/HECS – FY24-25 table (placeholder until client confirms FY25-26).
// Progressive rate applied to full income (as per Money tool).
// Replace with exact ATO thresholds when finalised.
const HELP_2425: { min: number; max: number; rate: number }[] = [
  { min: 0, max: 51_550, rate: 0.0 },
  { min: 51_550, max: 59_440, rate: 0.01 },
  { min: 59_440, max: 63_790, rate: 0.02 },
  { min: 63_790, max: 67_676, rate: 0.025 },
  { min: 67_676, max: 71_701, rate: 0.03 },
  { min: 71_701, max: 75_957, rate: 0.035 },
  { min: 75_957, max: 80_450, rate: 0.04 },
  { min: 80_450, max: 85_189, rate: 0.045 },
  { min: 85_189, max: 90_180, rate: 0.05 },
  { min: 90_180, max: 95_437, rate: 0.055 },
  { min: 95_437, max: 100_966, rate: 0.06 },
  { min: 100_966, max: 106_783, rate: 0.065 },
  { min: 106_783, max: 112_896, rate: 0.07 },
  { min: 112_896, max: 119_321, rate: 0.075 },
  { min: 119_321, max: 126_069, rate: 0.08 },
  { min: 126_069, max: 133_157, rate: 0.085 },
  { min: 133_157, max: 140_598, rate: 0.09 },
  { min: 140_598, max: 148_404, rate: 0.095 },
  { min: 148_404, max: Infinity, rate: 0.1 },
];

/* ========= Helpers ========= */

const bracketTax = (
  income: number,
  brackets: { upTo: number; base: number; rate: number; over: number }[]
) => {
  for (const b of brackets) {
    if (income <= b.upTo) {
      return Math.max(0, b.base + (income - b.over) * b.rate);
    }
  }
  return 0;
};

// Resident Stage-3
const residentTax = (income: number) => bracketTax(income, RESIDENT_2526);
// Non-resident
const nonResidentTax = (income: number) => bracketTax(income, NONRES_2526);
// WHM tax
const whmTax = (income: number) => bracketTax(income, WHM);

// If resident but NOT claiming TFT (or second job), add back 16% on the $18,200–$45,000 band
const noTFTAdjustment = (income: number) => {
  const band = Math.max(0, Math.min(income, 45_000) - 18_200);
  return 0.16 * band;
};

const calcMedicareLevy = (
  income: number,
  residency: Residency,
  reduction: MedicareReduction
) => {
  if (residency === "non_resident") return 0;
  const rate =
    reduction === "full" ? 0 : reduction === "half" ? ML_RATE / 2 : ML_RATE;
  return income * rate;
};

const calcMLS = (
  baseIncome: number,
  residency: Residency,
  hasPrivateHealth: boolean,
  familyStatus: FamilyStatus,
  dependants: number
) => {
  if (residency === "non_resident" || hasPrivateHealth) return 0;

  if (familyStatus === "single") {
    const band = MLS_SINGLE.find((b) => baseIncome <= b.upTo)!;
    return baseIncome * band.rate;
  }

  // family thresholds with dependants (>=1 dependants adds increments after the first)
  const extra = Math.max(0, dependants - 1) * MLS_DEP_INC;
  const t0 = MLS_FAMILY_BASE.tier0 + extra;
  const t1 = MLS_FAMILY_BASE.tier1 + extra;
  const t2 = MLS_FAMILY_BASE.tier2 + extra;
  const rate =
    baseIncome <= t0
      ? 0
      : baseIncome <= t1
      ? 0.01
      : baseIncome <= t2
      ? 0.0125
      : 0.015;
  return baseIncome * rate;
};

const calcHELP = (income: number, table = HELP_2425) => {
  const row =
    table.find((r) => income >= r.min && income < r.max) ??
    table[table.length - 1];
  return income * row.rate;
};

const marginalRateFrom = (
  income: number,
  mode: "resident" | "non_resident" | "whm"
): number => {
  const tables = {
    resident: RESIDENT_2526,
    non_resident: NONRES_2526,
    whm: WHM,
  } as const;
  const b = tables[mode].find((br) => income <= br.upTo)!;
  return b.rate;
};

/* ========= Public API ========= */

export const calculateTax = (raw: CalculationInputs): AnnualBreakdown => {
  const {
    salary,
    frequency,
    includesSuper,
    superRate,
    residency,
    claimTaxFreeThreshold,
    isSecondJob,
    onWorkingHolidayVisa,
    hasHELP,
    hasStudentLoanDebt,
    hasPrivateHealth,
    medicareReduction,
    familyStatus,
    numberOfDependants,
  } = raw;

  const superPct = (superRate ?? 12) / 100;

  // 1) Annualise & split package if needed
  const annualGross = toAnnual(salary || 0, frequency);
  const baseIncome = includesSuper ? annualGross / (1 + superPct) : annualGross;
  const employerSuper = baseIncome * superPct;
  const taxableIncome = baseIncome; // no deductions in v1

  // 2) Income tax
  let incomeTax = 0;
  let mode: "resident" | "non_resident" | "whm" = "resident";

  if (onWorkingHolidayVisa) {
    incomeTax = whmTax(taxableIncome);
    mode = "whm";
  } else if (residency === "resident") {
    incomeTax = residentTax(taxableIncome);
    const claimTFT = claimTaxFreeThreshold && !isSecondJob;
    if (!claimTFT) incomeTax += noTFTAdjustment(taxableIncome);
    mode = "resident";
  } else {
    incomeTax = nonResidentTax(taxableIncome);
    mode = "non_resident";
  }

  // 3) Medicare Levy & Surcharge
  const medicareLevy = calcMedicareLevy(
    taxableIncome,
    residency,
    medicareReduction
  );
  const mls = calcMLS(
    baseIncome,
    residency,
    hasPrivateHealth,
    familyStatus,
    numberOfDependants || 0
  );

  // 4) HELP/HECS (toggle accepts either flag)
  const wantsHELP = hasHELP || hasStudentLoanDebt === true;
  const help = wantsHELP ? calcHELP(baseIncome) : 0;

  // 5) Offsets (hooks – left at 0 to match Money example unless you enable SAPTO)
  const sapto = 0; // raw.eligibleForSAPTO ? calcSAPTO(...) : 0
  const taxOffsets = 0; // extension hook

  const totalTax = Math.max(
    0,
    incomeTax + medicareLevy + mls + help - sapto - taxOffsets
  );
  const takeHome = baseIncome - totalTax;

  const marginalTaxRate = marginalRateFrom(taxableIncome, mode);

  return {
    baseIncome,
    employerSuper,
    taxableIncome,
    incomeTax,
    medicareLevy,
    mls,
    help,
    sapto,
    taxOffsets,
    totalTax,
    takeHome,
    marginalTaxRate,
  };
};
