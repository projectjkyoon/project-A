export interface TaxLiabilityInput {
  taxableIncome: number;
  taxYear: number;
}

export interface TaxLiabilityResult {
  tax: number;
  breakdown: { bracket: string; amount: number }[];
}

const brackets2023 = [
  { upTo: 11000, rate: 0.1 },
  { upTo: 44725, rate: 0.12 },
  { upTo: 95375, rate: 0.22 },
  { upTo: 182100, rate: 0.24 },
  { upTo: 231250, rate: 0.32 },
  { upTo: 578125, rate: 0.35 },
  { upTo: Infinity, rate: 0.37 }
];

export function computeTaxLiability(input: TaxLiabilityInput): TaxLiabilityResult {
  let remaining = input.taxableIncome;
  let prevCap = 0;
  const breakdown: { bracket: string; amount: number }[] = [];
  let totalTax = 0;

  for (const bracket of brackets2023) {
    if (remaining <= 0) break;
    const taxableAtRate = Math.min(remaining, bracket.upTo - prevCap);
    const taxForBracket = taxableAtRate * bracket.rate;
    if (taxableAtRate > 0) {
      breakdown.push({ bracket: `${prevCap + 1}-${bracket.upTo}`, amount: taxForBracket });
      totalTax += taxForBracket;
      remaining -= taxableAtRate;
      prevCap = bracket.upTo;
    }
  }

  return { tax: totalTax, breakdown };
}
