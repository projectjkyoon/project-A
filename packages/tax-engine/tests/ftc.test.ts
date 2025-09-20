import { describe, expect, it } from 'vitest';
import { computeForeignTaxCredit } from '../src/modules/ftc';

describe('computeForeignTaxCredit', () => {
  it('applies limitation and calculates carryover', () => {
    const result = computeForeignTaxCredit({
      taxYear: 2023,
      taxableIncome: 100000,
      usTaxBeforeCredits: 20000,
      foreignSourceTaxableIncome: 60000,
      foreignTaxesPaid: 15000,
      basket: 'general'
    });
    expect(result.allowableCredit).toBeCloseTo(12000, 2);
    expect(result.excessCarryover).toBeCloseTo(3000, 2);
  });
});
