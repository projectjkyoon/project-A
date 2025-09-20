import { describe, expect, it } from 'vitest';
import { determineResidency } from '../src/modules/residency';

describe('determineResidency', () => {
  it('flags green card holders as residents', () => {
    const result = determineResidency({
      taxYear: 2023,
      daysInUS: 50,
      hasGreenCard: true,
      visaStatus: 'LPR'
    });
    expect(result.status).toBe('us-resident');
    expect(result.recommendedForm).toBe('1040');
    expect(result.feieEligible).toBe(false);
  });

  it('identifies nonresidents without substantial presence', () => {
    const result = determineResidency({
      taxYear: 2023,
      daysInUS: 70,
      hasGreenCard: false,
      visaStatus: 'E-2',
      physicalPresenceDaysAbroad: 330
    });
    expect(result.status).toBe('nonresident');
    expect(result.recommendedForm).toBe('1040-NR');
  });
});
