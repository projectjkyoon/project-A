import { getYearConfig } from '../config/thresholds';

export type IncomeBasket = 'general' | 'passive';

export interface ForeignTaxCreditInput {
  taxYear: number;
  taxableIncome: number;
  usTaxBeforeCredits: number;
  foreignSourceTaxableIncome: number;
  foreignTaxesPaid: number;
  basket: IncomeBasket;
}

export interface ForeignTaxCreditComputation {
  allowableCredit: number;
  excessCarryover: number;
  notes: string[];
}

export function computeForeignTaxCredit(input: ForeignTaxCreditInput): ForeignTaxCreditComputation {
  const config = getYearConfig(input.taxYear);
  const limitation = input.usTaxBeforeCredits * (input.foreignSourceTaxableIncome / Math.max(input.taxableIncome, 1));
  const allowableCredit = Math.min(input.foreignTaxesPaid, limitation);
  const excessCarryover = Math.max(input.foreignTaxesPaid - allowableCredit, 0);

  const notes = [
    `Limitation rate applied using ratio of foreign source income to worldwide income (${(input.foreignSourceTaxableIncome / Math.max(input.taxableIncome, 1)).toFixed(2)}).`,
    `Marginal tax rate assumed at ${config.ftcLimitationRate * 100}% for planning.`
  ];

  if (excessCarryover > 0) {
    notes.push('Excess foreign taxes available for carryover (Form 1116 Schedule B stub).');
  }

  return {
    allowableCredit,
    excessCarryover,
    notes
  };
}
