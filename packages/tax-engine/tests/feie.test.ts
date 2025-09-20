import { describe, expect, it } from 'vitest';
import { computeFeie } from '../src/modules/feie';

describe('computeFeie', () => {
  it('limits exclusion to statutory maximum', () => {
    const result = computeFeie({
      taxYear: 2023,
      foreignEarnedIncome: 150000,
      housingCosts: 20000,
      qualifiesPhysicalPresence: true,
      qualifiesBonaFideResidence: false,
      country: 'KOR'
    });
    expect(result.qualifies).toBe(true);
    expect(result.exclusionAmount).toBe(120000);
    expect(result.housingExclusion).toBe(20000);
  });

  it('returns zero when taxpayer does not qualify', () => {
    const result = computeFeie({
      taxYear: 2023,
      foreignEarnedIncome: 50000,
      qualifiesPhysicalPresence: false,
      qualifiesBonaFideResidence: false
    });
    expect(result.qualifies).toBe(false);
    expect(result.exclusionAmount).toBe(0);
  });
});
