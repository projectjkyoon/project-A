import { computeAdjustments, AdjustmentInput } from './adjustments';
import { computeDeduction, DeductionInput } from './deductions';
import { computeFeie, FeieInput } from './feie';
import { computeForeignTaxCredit, ForeignTaxCreditInput } from './ftc';
import { combineCredits, CreditsInput } from './credits';
import { computeTaxLiability } from './tax-liability';
import { normalizeIncome, IncomeEntry } from './income';

export interface TaxComputationInput {
  taxYear: number;
  filingStatus: DeductionInput['filingStatus'];
  incomeEntries: IncomeEntry[];
  adjustments?: AdjustmentInput;
  itemizedDeductions?: number;
  feie?: FeieInput;
  ftc?: ForeignTaxCreditInput;
  credits?: CreditsInput;
}

export interface TaxComputationResult {
  agi: number;
  taxableIncome: number;
  taxLiability: number;
  credits: number;
  refundOrBalance: number;
  notes: string[];
}

export function computeReturn(input: TaxComputationInput): TaxComputationResult {
  const normalized = normalizeIncome(input.incomeEntries);
  const adjustments = computeAdjustments(input.adjustments ?? {});
  const grossIncome = normalized.w2Wages + normalized.foreignWages + normalized.businessIncome + normalized.passiveIncome;
  const feieResult = input.feie ? computeFeie(input.feie) : undefined;
  const incomeAfterFeie = feieResult ? grossIncome - feieResult.exclusionAmount - feieResult.housingExclusion : grossIncome;
  const agi = Math.max(incomeAfterFeie - adjustments.adjustmentsTotal, 0);

  const deduction = computeDeduction({
    taxYear: input.taxYear,
    filingStatus: input.filingStatus,
    itemizedDeductions: input.itemizedDeductions
  });

  const taxableIncome = Math.max(agi - deduction.deduction, 0);
  const taxLiability = computeTaxLiability({ taxableIncome, taxYear: input.taxYear });

  const ftcResult = input.ftc ? computeForeignTaxCredit(input.ftc) : undefined;
  const credits = combineCredits({ ...input.credits, foreignTaxCredit: ftcResult });

  const refundOrBalance = taxLiability.tax - credits.totalCredits;

  const notes = [
    deduction.type === 'standard' ? 'Standard deduction applied.' : 'Itemized deductions used.',
    feieResult ? `FEIE exclusion applied: $${feieResult.exclusionAmount}.` : 'No FEIE applied.',
    ftcResult ? `Foreign tax credit allowed: $${ftcResult.allowableCredit}.` : 'No foreign tax credit applied.'
  ];

  return {
    agi,
    taxableIncome,
    taxLiability: taxLiability.tax,
    credits: credits.totalCredits,
    refundOrBalance,
    notes
  };
}
