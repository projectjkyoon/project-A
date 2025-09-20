import { getYearConfig } from '../config/thresholds';

export interface DeductionInput {
  taxYear: number;
  filingStatus: 'single' | 'mfj' | 'mfs' | 'hoh';
  itemizedDeductions?: number;
}

export interface DeductionResult {
  deduction: number;
  type: 'standard' | 'itemized';
}

export function computeDeduction(input: DeductionInput): DeductionResult {
  const config = getYearConfig(input.taxYear);
  const standard = config.standardDeduction[input.filingStatus];
  const itemized = input.itemizedDeductions ?? 0;

  if (itemized > standard) {
    return { deduction: itemized, type: 'itemized' };
  }

  return { deduction: standard, type: 'standard' };
}
