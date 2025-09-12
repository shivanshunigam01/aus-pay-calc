// Australian tax logic aligned to ATO / money.com.au for 2024–25 & 2025–26

export type FinancialYear = "2024-25" | "2025-26";
export type Residency = "resident" | "non-resident";
export type MLReduction = "none" | "half" | "full"; // kept for compatibility (not used)

type Bracket = { min: number; max: number; rate: number; base: number };

// Stage-3 resident/non-resident brackets (same for 24–25 and 25–26 in reference)
const BRACKETS_RES: Bracket[] = [
  { min: 0, max: 18_200, rate: 0.0, base: 0 },
  { min: 18_200, max: 45_000, rate: 0.16, base: 0 },
  { min: 45_000, max: 135_000, rate: 0.3, base: 4_288 }, // 0.16*(45k-18.2k)
  { min: 135_000, max: 190_000, rate: 0.37, base: 31_288 }, // +0.30*(135k-45k)
  { min: 190_000, max: Infinity, rate: 0.45, base: 51_638 }, // +0.37*(190k-135k)
];

const BRACKETS_NONRES: Bracket[] = [
  { min: 0, max: 135_000, rate: 0.3, base: 0 },
  { min: 135_000, max: 190_000, rate: 0.37, base: 40_500 },
  { min: 190_000, max: Infinity, rate: 0.45, base: 61_950 },
];

const BRACKETS: Record<FinancialYear, Record<Residency, Bracket[]>> = {
  "2024-25": { resident: BRACKETS_RES, "non-resident": BRACKETS_NONRES },
  "2025-26": { resident: BRACKETS_RES, "non-resident": BRACKETS_NONRES },
};

// HELP (student loans)
function calcHELP_2025_26(taxableIncome: number): number {
  // Marginal scheme:
  // $0–67,000: Nil
  // $67,001–124,999: 15c per $ over 67,000
  // $125,000+: $8,700 + 17c per $ over 125,000
  if (taxableIncome <= 67_000) return 0;
  if (taxableIncome <= 124_999) return 0.15 * (taxableIncome - 67_000);
  return 8_700 + 0.17 * (taxableIncome - 125_000);
}

export const HELP_TABLE_2024_25 = [
  { min: 54_435, max: 62_850, rate: 0.01 },
  { min: 62_851, max: 66_620, rate: 0.02 },
  { min: 66_621, max: 70_618, rate: 0.025 },
  { min: 70_619, max: 74_855, rate: 0.03 },
  { min: 74_856, max: 79_346, rate: 0.035 },
  { min: 79_347, max: 84_107, rate: 0.04 },
  { min: 84_108, max: 89_154, rate: 0.045 },
  { min: 89_155, max: 94_504, rate: 0.05 },
  { min: 94_505, max: 100_174, rate: 0.055 },
  { min: 100_175, max: 106_184, rate: 0.06 },
  { min: 106_185, max: 112_556, rate: 0.065 },
  { min: 112_557, max: 119_311, rate: 0.07 },
  { min: 119_312, max: 126_474, rate: 0.075 },
  { min: 126_475, max: 134_072, rate: 0.08 },
  { min: 134_073, max: 142_131, rate: 0.085 },
  { min: 142_132, max: 150_678, rate: 0.09 },
  { min: 150_679, max: Infinity, rate: 0.1 },
];

function calcHELP_2024_25(taxableIncome: number): number {
  for (const t of HELP_TABLE_2024_25) {
    if (taxableIncome >= t.min && taxableIncome <= t.max)
      return taxableIncome * t.rate;
  }
  return 0;
}

// Medicare levy – low-income phase-in + family thresholds (+ dependants)
type MLThresholds = { lower: number; upper: number };

function medicareLowIncomeThresholds(
  year: FinancialYear,
  familyStatus: "single" | "family",
  dependants: number,
  eligibleForSAPTO: boolean
): MLThresholds {
  // 2025–26 thresholds (OK to reuse for 2024–25 for parity with reference)
  // Singles: lower 27,222 | upper 34,027; SAPTO single: 43,020 | 53,775
  // Families: lower 45,907 | upper 57,383 (+4,216 / +5,270 per extra child)
  // SAPTO family: 59,886 | 74,857 (+4,216 / +5,270 per extra child)
  const extraLower = Math.max(0, dependants - 1) * 4_216;
  const extraUpper = Math.max(0, dependants - 1) * 5_270;

  if (familyStatus === "single") {
    if (eligibleForSAPTO) return { lower: 43_020, upper: 53_775 };
    return { lower: 27_222, upper: 34_027 };
  }
  if (eligibleForSAPTO)
    return { lower: 59_886 + extraLower, upper: 74_857 + extraUpper };
  return { lower: 45_907 + extraLower, upper: 57_383 + extraUpper };
}

function calcMedicareLevyCore(
  taxableIncome: number,
  residency: Residency,
  year: FinancialYear,
  familyStatus: "single" | "family",
  dependants: number,
  eligibleForSAPTO: boolean
): number {
  if (residency === "non-resident" || taxableIncome <= 0) return 0;

  const { lower, upper } = medicareLowIncomeThresholds(
    year,
    familyStatus,
    dependants,
    eligibleForSAPTO
  );
  if (taxableIncome <= lower) return 0;

  const standard = 0.02 * taxableIncome;
  if (taxableIncome < upper) {
    // ATO phase-in: 10% of (income - lower). Capped at the standard levy.
    const phased = 0.1 * (taxableIncome - lower);
    return Math.min(standard, Math.max(0, phased));
  }
  return standard;
}

// Medicare levy surcharge (MLS) – 2025–26 threshold bump
type MLSConf = {
  baseSingle: number;
  baseFamily: number;
  tiers: { max: number; rate: number }[];
};

const MLS_2024_25: MLSConf = {
  baseSingle: 97_000,
  baseFamily: 194_000,
  tiers: [
    { max: 113_000, rate: 0.01 },
    { max: 151_000, rate: 0.0125 },
    { max: Infinity, rate: 0.015 },
  ],
};

const MLS_2025_26: MLSConf = {
  baseSingle: 101_000,
  baseFamily: 202_000,
  tiers: [
    { max: 118_000, rate: 0.01 },
    { max: 151_000, rate: 0.0125 },
    { max: Infinity, rate: 0.015 },
  ],
};

function calcMLSCore(
  incomeBase: number,
  residency: Residency,
  hasPrivateHealth: boolean,
  year: FinancialYear,
  familyStatus: "single" | "family",
  dependants: number
): number {
  if (residency === "non-resident" || hasPrivateHealth) return 0;

  const cfg = year === "2025-26" ? MLS_2025_26 : MLS_2024_25;
  // family base increases by $1,500 per extra dependent child after the first
  const familyBase = cfg.baseFamily + Math.max(0, dependants - 1) * 1_500;
  const threshold = familyStatus === "family" ? familyBase : cfg.baseSingle;

  if (incomeBase <= threshold) return 0;
  for (const t of cfg.tiers) {
    if (incomeBase <= t.max) return incomeBase * t.rate;
  }
  return incomeBase * cfg.tiers[cfg.tiers.length - 1].rate;
}

export interface TaxCalculation {
  baseIncome: number; // taxable income (gross excluding super if package)
  employerSuper: number;
  taxableIncome: number; // same as baseIncome
  incomeTax: number;
  medicareLevy: number;
  medicareLevySurcharge: number;
  helpRepayment: number;
  totalDeductions: number;
  takeHomeAnnual: number;
  marginalRate: number; // e.g. 0.30
}

export interface CalculationInputs {
  spouseIncome: number;
  salary: number;
  frequency: "weekly" | "monthly" | "annually";
  includesSuper: boolean;
  superRate: number;
  year: FinancialYear;
  residency: Residency;
  claimTaxFreeThreshold: boolean; // PAYG-only; does not change annual liability
  hasHELP: boolean;
  hasPrivateHealth: boolean;
  isSecondJob: boolean; // PAYG-only; ignored for annual liability
  medicareReduction: MLReduction; // not used; levy reduction auto-applies
  hasStudentLoanDebt: boolean;
  onWorkingHolidayVisa: boolean; // not modelled here
  familyStatus: "single" | "family";
  numberOfDependants: number;
  eligibleForSAPTO: boolean;
}

// Income tax core
function calcIncomeTaxCore(
  taxable: number,
  residency: Residency,
  year: FinancialYear
) {
  const b = BRACKETS[year][residency];
  if (taxable <= 0) return { tax: 0, rate: 0 };
  for (let i = b.length - 1; i >= 0; i--) {
    if (taxable > b[i].min) {
      const tax = b[i].base + (taxable - b[i].min) * b[i].rate;
      return { tax, rate: b[i].rate };
    }
  }
  return { tax: 0, rate: 0 };
}

export const calculateTax = (inputs: CalculationInputs): TaxCalculation => {
  // 1) Annual “package” as entered
  const annualGross =
    inputs.frequency === "weekly"
      ? inputs.salary * 52
      : inputs.frequency === "monthly"
      ? inputs.salary * 12
      : inputs.salary;

  // 2) Base salary (taxable) when package includes super
  const baseIncome = inputs.includesSuper
    ? annualGross / (1 + inputs.superRate / 100)
    : annualGross;

  const employerSuper = baseIncome * (inputs.superRate / 100);
  const taxableIncome = Math.max(0, baseIncome); // THIS is the base for all items below

  // 3) Income tax (do NOT alter for tax-free threshold; PAYG only)
  const { tax: incomeTax, rate: marginalRate } = calcIncomeTaxCore(
    taxableIncome,
    inputs.residency,
    inputs.year
  );

  // 4) Medicare levy (low-income reduction + family thresholds)
  const medicareLevy = calcMedicareLevyCore(
    taxableIncome,
    inputs.residency,
    inputs.year,
    inputs.familyStatus,
    inputs.numberOfDependants,
    inputs.eligibleForSAPTO
  );

  // 5) Medicare levy surcharge
  const medicareLevySurcharge = calcMLSCore(
    taxableIncome, // reasonable proxy for "income for MLS"
    inputs.residency,
    inputs.hasPrivateHealth,
    inputs.year,
    inputs.familyStatus,
    inputs.numberOfDependants
  );

  // 6) HELP/HECS
  const helpRepayment = inputs.hasHELP
    ? inputs.year === "2025-26"
      ? calcHELP_2025_26(taxableIncome)
      : calcHELP_2024_25(taxableIncome)
    : 0;

  const totalDeductions =
    incomeTax + medicareLevy + medicareLevySurcharge + helpRepayment;
  const takeHomeAnnual = taxableIncome - totalDeductions;

  return {
    baseIncome: taxableIncome, // equals gross-excl-super when package includes super
    employerSuper,
    taxableIncome,
    incomeTax,
    medicareLevy,
    medicareLevySurcharge,
    helpRepayment,
    totalDeductions,
    takeHomeAnnual,
    marginalRate,
  };
};

