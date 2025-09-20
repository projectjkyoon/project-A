import { convertCurrency } from '../config/rates';

type IncomeType = 'w2' | 'foreign-wage' | 'business' | 'passive';

export interface IncomeEntry {
  type: IncomeType;
  amount: number;
  currency?: string;
  taxYear: number;
  country?: string;
}

export interface NormalizedIncome {
  w2Wages: number;
  foreignWages: number;
  businessIncome: number;
  passiveIncome: number;
}

export function normalizeIncome(entries: IncomeEntry[]): NormalizedIncome {
  return entries.reduce<NormalizedIncome>(
    (acc, entry) => {
      const currency = entry.currency ?? 'USD';
      const usdAmount = convertCurrency(entry.amount, entry.taxYear, currency);
      switch (entry.type) {
        case 'w2':
          acc.w2Wages += usdAmount;
          break;
        case 'foreign-wage':
          acc.foreignWages += usdAmount;
          break;
        case 'business':
          acc.businessIncome += usdAmount;
          break;
        case 'passive':
          acc.passiveIncome += usdAmount;
          break;
        default:
          throw new Error(`Unsupported income type ${(entry as { type: string }).type}`);
      }
      return acc;
    },
    { w2Wages: 0, foreignWages: 0, businessIncome: 0, passiveIncome: 0 }
  );
}
