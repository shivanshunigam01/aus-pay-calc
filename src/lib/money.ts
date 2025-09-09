// Australian money formatting utilities

export const formatAUD = (n: number): string =>
  new Intl.NumberFormat('en-AU', { 
    style: 'currency', 
    currency: 'AUD', 
    maximumFractionDigits: 2 
  }).format(n || 0);

export const formatNumber = (n: number): string =>
  new Intl.NumberFormat('en-AU', { 
    maximumFractionDigits: 2 
  }).format(n || 0);

export type Frequency = 'weekly' | 'monthly' | 'annually';

export const toAnnual = (amount: number, frequency: Frequency): number => {
  switch (frequency) {
    case 'weekly': return amount * 52;
    case 'monthly': return amount * 12;
    case 'annually': return amount;
    default: return amount;
  }
};

export const fromAnnual = (annual: number, frequency: Frequency): number => {
  switch (frequency) {
    case 'weekly': return annual / 52;
    case 'monthly': return annual / 12;
    case 'annually': return annual;
    default: return annual;
  }
};