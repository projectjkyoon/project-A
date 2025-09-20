export interface AdjustmentInput {
  seTaxDeduction?: number;
  iraDeduction?: number;
  studentLoanInterest?: number;
}

export function computeAdjustments(input: AdjustmentInput): { adjustmentsTotal: number } {
  const values = [input.seTaxDeduction, input.iraDeduction, input.studentLoanInterest].filter((v): v is number => typeof v === 'number');
  return {
    adjustmentsTotal: values.reduce((sum, value) => sum + value, 0)
  };
}
