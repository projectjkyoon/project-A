import { describe, expect, it } from 'vitest';
import { computeReturn } from '../src/modules/computation';

const TAX_YEAR = 2023;

describe('Acceptance Scenarios', () => {
  it('Case A: 1040-NR with treaty statement', () => {
    const result = computeReturn({
      taxYear: TAX_YEAR,
      filingStatus: 'single',
      incomeEntries: [
        { type: 'w2', amount: 30000, currency: 'USD', taxYear: TAX_YEAR }
      ],
      itemizedDeductions: 0
    });
    expect(result.taxLiability).toBeGreaterThan(0);
    expect(result.taxableIncome).toBeGreaterThan(0);
  });

  it('Case B: 1040 with FEIE', () => {
    const result = computeReturn({
      taxYear: TAX_YEAR,
      filingStatus: 'single',
      incomeEntries: [
        { type: 'foreign-wage', amount: 120000000, currency: 'KRW', taxYear: TAX_YEAR }
      ],
      feie: {
        taxYear: TAX_YEAR,
        foreignEarnedIncome: 120000,
        housingCosts: 15000,
        qualifiesPhysicalPresence: true,
        qualifiesBonaFideResidence: true,
        country: 'KOR'
      }
    });
    expect(result.agi).toBeLessThan(60000);
    expect(result.taxLiability).toBeGreaterThanOrEqual(0);
  });

  it('Case C: 1040 with FTC', () => {
    const result = computeReturn({
      taxYear: TAX_YEAR,
      filingStatus: 'single',
      incomeEntries: [
        { type: 'foreign-wage', amount: 100000, currency: 'USD', taxYear: TAX_YEAR }
      ],
      ftc: {
        taxYear: TAX_YEAR,
        taxableIncome: 100000,
        usTaxBeforeCredits: 20000,
        foreignSourceTaxableIncome: 100000,
        foreignTaxesPaid: 22000,
        basket: 'general'
      }
    });
    expect(result.credits).toBeGreaterThan(0);
    expect(result.refundOrBalance).toBeLessThan(result.taxLiability);
  });
});
