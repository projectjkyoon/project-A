import averageRates from '../../../../rates/2023.json';

export interface CurrencyRate {
  currency: string;
  usdRate: number;
}

export function convertCurrency(amount: number, year: number, from: string, to = 'USD') {
  if (from === to) return amount;
  const rates = getAverageRates(year);
  const rate = rates.find((r) => r.currency === from);
  if (!rate) {
    throw new Error(`Missing rate for ${from}`);
  }
  return amount / rate.usdRate;
}

export function getAverageRates(year: number): CurrencyRate[] {
  if (year === 2023) {
    return averageRates;
  }
  throw new Error(`Rates not configured for year ${year}`);
}
