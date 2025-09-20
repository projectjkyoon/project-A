import { getYearConfig } from '../config/thresholds';

export interface FeieInput {
  taxYear: number;
  foreignEarnedIncome: number;
  housingCosts?: number;
  qualifiesPhysicalPresence: boolean;
  qualifiesBonaFideResidence: boolean;
  country?: string;
}

export interface FeieComputation {
  qualifies: boolean;
  exclusionAmount: number;
  housingExclusion: number;
  notes: string[];
}

export function computeFeie(input: FeieInput): FeieComputation {
  const config = getYearConfig(input.taxYear);
  const qualifies = input.qualifiesPhysicalPresence || input.qualifiesBonaFideResidence;
  const notes: string[] = [];

  if (!qualifies) {
    notes.push('Taxpayer does not meet physical presence or bona fide residence tests.');
    return { qualifies: false, exclusionAmount: 0, housingExclusion: 0, notes };
  }

  const exclusionAmount = Math.min(input.foreignEarnedIncome, config.feieLimit);
  notes.push(`Exclusion limited to Form 2555 maximum of $${config.feieLimit}.`);

  const housingCap = config.housingCap[input.country ?? 'default'] ?? config.housingCap.default;
  const housingCosts = input.housingCosts ?? 0;
  const housingExclusion = Math.min(housingCosts, housingCap);
  if (housingExclusion > 0) {
    notes.push(`Housing exclusion capped at $${housingCap}.`);
  }

  return {
    qualifies: true,
    exclusionAmount,
    housingExclusion,
    notes
  };
}
