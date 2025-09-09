// /lib/money.ts
export type Frequency = "weekly" | "monthly" | "annually";

export const formatAUD = (n: number) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(n) ? n : 0);

export const toAnnual = (v: number, f: Frequency) =>
  f === "weekly" ? v * 52 : f === "monthly" ? v * 12 : v;

export const fromAnnual = (v: number, f: Frequency) =>
  f === "weekly" ? v / 52 : f === "monthly" ? v / 12 : v;
