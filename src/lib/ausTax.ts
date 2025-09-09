// Australian Tax Office (ATO) calculations for 2024-25 and 2025-26 financial years

export type FinancialYear = '2024-25' | '2025-26';
export type Residency = 'resident' | 'non-resident';
export type MLReduction = 'none' | 'half' | 'full';

// Income Tax Brackets - Stage 3 tax cuts effective 1 July 2024
export const INCOME_TAX_BRACKETS = {
  '2025-26': {
    resident: [
      { min: 0, max: 18200, rate: 0, fixed: 0 },
      { min: 18201, max: 45000, rate: 0.16, fixed: 0 },
      { min: 45001, max: 135000, rate: 0.30, fixed: 4288 },
      { min: 135001, max: 190000, rate: 0.37, fixed: 31288 },
      { min: 190001, max: Infinity, rate: 0.45, fixed: 51638 }
    ],
    'non-resident': [
      { min: 0, max: 135000, rate: 0.30, fixed: 0 },
      { min: 135001, max: 190000, rate: 0.37, fixed: 40500 },
      { min: 190001, max: Infinity, rate: 0.45, fixed: 61950 }
    ]
  },
  '2024-25': {
    // Fallback to same rates as 2025-26 (Stage 3 cuts applied from 1 July 2024)
    resident: [
      { min: 0, max: 18200, rate: 0, fixed: 0 },
      { min: 18201, max: 45000, rate: 0.16, fixed: 0 },
      { min: 45001, max: 135000, rate: 0.30, fixed: 4288 },
      { min: 135001, max: 190000, rate: 0.37, fixed: 31288 },
      { min: 190001, max: Infinity, rate: 0.45, fixed: 51638 }
    ],
    'non-resident': [
      { min: 0, max: 135000, rate: 0.30, fixed: 0 },
      { min: 135001, max: 190000, rate: 0.37, fixed: 40500 },
      { min: 190001, max: Infinity, rate: 0.45, fixed: 61950 }
    ]
  }
};

// Medicare Levy Surcharge thresholds (singles)
export const MLS_THRESHOLDS = {
  tier0: { max: 97000, rate: 0 },
  tier1: { min: 97001, max: 113000, rate: 0.01 },
  tier2: { min: 113001, max: 151000, rate: 0.0125 },
  tier3: { min: 151001, rate: 0.015 }
};

// HELP/HECS repayment thresholds
export const HELP_TABLE_2025_26 = [
  { min: 54435, max: 62850, rate: 0.01 },
  { min: 62851, max: 66620, rate: 0.02 },
  { min: 66621, max: 70618, rate: 0.025 },
  { min: 70619, max: 74855, rate: 0.03 },
  { min: 74856, max: 79346, rate: 0.035 },
  { min: 79347, max: 84107, rate: 0.04 },
  { min: 84108, max: 89154, rate: 0.045 },
  { min: 89155, max: 94504, rate: 0.05 },
  { min: 94505, max: 100174, rate: 0.055 },
  { min: 100175, max: 106184, rate: 0.06 },
  { min: 106185, max: 112556, rate: 0.065 },
  { min: 112557, max: 119311, rate: 0.07 },
  { min: 119312, max: 126474, rate: 0.075 },
  { min: 126475, max: 134072, rate: 0.08 },
  { min: 134073, max: 142131, rate: 0.085 },
  { min: 142132, max: 150678, rate: 0.09 },
  { min: 150679, max: Infinity, rate: 0.10 }
];

export const HELP_TABLE_2024_25 = HELP_TABLE_2025_26; // Same thresholds

export const calcIncomeTax = (
  taxableIncome: number,
  residency: Residency,
  claimTaxFreeThreshold: boolean,
  year: FinancialYear
): number => {
  const brackets = INCOME_TAX_BRACKETS[year][residency];
  let tax = 0;

  for (const bracket of brackets) {
    if (taxableIncome <= bracket.min) break;
    
    const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min + 1;
    if (taxableInBracket > 0) {
      tax = bracket.fixed + (taxableIncome - bracket.min) * bracket.rate;
    }
  }

  // Tax-free threshold adjustment for residents
  if (residency === 'resident' && !claimTaxFreeThreshold) {
    const adjustment = 0.16 * Math.min(taxableIncome, 45000 - 18200);
    tax += adjustment;
  }

  return Math.max(0, tax);
};

export const calcMedicareLevy = (
  taxableIncome: number,
  residency: Residency,
  reduction: MLReduction
): number => {
  if (residency === 'non-resident') return 0;

  const baseLevy = taxableIncome * 0.02;
  
  switch (reduction) {
    case 'half': return baseLevy * 0.5;
    case 'full': return 0;
    default: return baseLevy;
  }
};

export const calcMedicareLevySurcharge = (
  baseIncome: number,
  residency: Residency,
  hasPrivateHealth: boolean
): number => {
  if (residency === 'non-resident' || hasPrivateHealth) return 0;

  if (baseIncome <= MLS_THRESHOLDS.tier0.max) return 0;
  if (baseIncome <= MLS_THRESHOLDS.tier1.max) return baseIncome * MLS_THRESHOLDS.tier1.rate;
  if (baseIncome <= MLS_THRESHOLDS.tier2.max) return baseIncome * MLS_THRESHOLDS.tier2.rate;
  return baseIncome * MLS_THRESHOLDS.tier3.rate;
};

export const calcHELP = (
  baseIncome: number,
  year: FinancialYear
): number => {
  const table = year === '2025-26' ? HELP_TABLE_2025_26 : HELP_TABLE_2024_25;
  
  for (const threshold of table) {
    if (baseIncome >= threshold.min && (threshold.max === Infinity || baseIncome <= threshold.max)) {
      return baseIncome * threshold.rate;
    }
  }
  
  return 0;
};

export interface TaxCalculation {
  baseIncome: number;
  employerSuper: number;
  taxableIncome: number;
  incomeTax: number;
  medicareLevy: number;
  medicareLevySurcharge: number;
  helpRepayment: number;
  totalDeductions: number;
  takeHomeAnnual: number;
}

export interface CalculationInputs {
  salary: number;
  frequency: 'weekly' | 'monthly' | 'annually';
  includesSuper: boolean;
  superRate: number;
  year: FinancialYear;
  residency: Residency;
  claimTaxFreeThreshold: boolean;
  hasHELP: boolean;
  hasPrivateHealth: boolean;
  isSecondJob: boolean;
  medicareReduction: MLReduction;
}

export const calculateTax = (inputs: CalculationInputs): TaxCalculation => {
  // Convert to annual
  const annualGross = inputs.frequency === 'weekly' ? inputs.salary * 52 :
                     inputs.frequency === 'monthly' ? inputs.salary * 12 :
                     inputs.salary;

  // Calculate base income and super
  const baseIncome = inputs.includesSuper 
    ? annualGross / (1 + inputs.superRate / 100)
    : annualGross;
  const employerSuper = baseIncome * (inputs.superRate / 100);
  const taxableIncome = baseIncome;

  // Force no tax-free threshold if second job
  const claimTFT = inputs.isSecondJob ? false : inputs.claimTaxFreeThreshold;

  // Calculate all deductions
  const incomeTax = calcIncomeTax(taxableIncome, inputs.residency, claimTFT, inputs.year);
  const medicareLevy = calcMedicareLevy(taxableIncome, inputs.residency, inputs.medicareReduction);
  const medicareLevySurcharge = calcMedicareLevySurcharge(baseIncome, inputs.residency, inputs.hasPrivateHealth);
  const helpRepayment = inputs.hasHELP ? calcHELP(baseIncome, inputs.year) : 0;

  const totalDeductions = incomeTax + medicareLevy + medicareLevySurcharge + helpRepayment;
  const takeHomeAnnual = baseIncome - totalDeductions;

  return {
    baseIncome,
    employerSuper,
    taxableIncome,
    incomeTax,
    medicareLevy,
    medicareLevySurcharge,
    helpRepayment,
    totalDeductions,
    takeHomeAnnual
  };
};