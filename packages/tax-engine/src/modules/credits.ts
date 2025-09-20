import { ForeignTaxCreditComputation } from './ftc';

export interface CreditsInput {
  childTaxCredit?: number;
  foreignTaxCredit?: ForeignTaxCreditComputation;
}

export interface CreditsResult {
  totalCredits: number;
  details: { label: string; amount: number }[];
}

export function combineCredits(input: CreditsInput): CreditsResult {
  const details: { label: string; amount: number }[] = [];
  if (input.childTaxCredit) {
    details.push({ label: 'Child Tax Credit', amount: input.childTaxCredit });
  }
  if (input.foreignTaxCredit) {
    details.push({ label: 'Foreign Tax Credit', amount: input.foreignTaxCredit.allowableCredit });
  }
  const totalCredits = details.reduce((sum, credit) => sum + credit.amount, 0);
  return { totalCredits, details };
}
