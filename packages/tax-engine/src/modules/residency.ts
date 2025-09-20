export type ResidencyStatus = 'us-resident' | 'nonresident' | 'dual-status';

export interface ResidencyInput {
  taxYear: number;
  daysInUS: number;
  hasGreenCard: boolean;
  visaStatus: string;
  physicalPresenceDaysAbroad?: number;
  bonaFideResidence?: boolean;
  isDualStatus?: boolean;
}

export interface ResidencyDetermination {
  status: ResidencyStatus;
  feieEligible: boolean;
  recommendedForm: '1040' | '1040-NR';
  rationale: string[];
}

export function determineResidency(input: ResidencyInput): ResidencyDetermination {
  const rationale: string[] = [];

  if (input.hasGreenCard) {
    rationale.push('Green card test met');
    return {
      status: input.isDualStatus ? 'dual-status' : 'us-resident',
      feieEligible: evaluateFeieEligibility(input),
      recommendedForm: '1040',
      rationale
    };
  }

  if (input.daysInUS >= 183) {
    rationale.push('Substantial presence test met');
    return {
      status: 'us-resident',
      feieEligible: evaluateFeieEligibility(input),
      recommendedForm: '1040',
      rationale
    };
  }

  if (input.isDualStatus) {
    rationale.push('Dual-status election indicated');
    return {
      status: 'dual-status',
      feieEligible: evaluateFeieEligibility(input),
      recommendedForm: '1040',
      rationale
    };
  }

  rationale.push('Did not meet substantial presence; treat as nonresident');
  return {
    status: 'nonresident',
    feieEligible: false,
    recommendedForm: '1040-NR',
    rationale
  };
}

function evaluateFeieEligibility(input: ResidencyInput): boolean {
  const abroadDays = input.physicalPresenceDaysAbroad ?? 0;
  const qualifiesPhysical = abroadDays >= 330;
  const qualifiesBonaFide = Boolean(input.bonaFideResidence);
  return qualifiesPhysical || qualifiesBonaFide;
}
