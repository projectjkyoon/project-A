export interface YearConfig {
  feieLimit: number;
  standardDeduction: Record<string, number>;
  housingCap: Record<string, number>;
  ftcLimitationRate: number;
}

export const yearConfigs: Record<string, YearConfig> = {
  '2023': {
    feieLimit: 120000,
    standardDeduction: {
      single: 13850,
      mfj: 27700,
      mfs: 13850,
      hoh: 20800
    },
    housingCap: {
      default: 36500,
      KOR: 45000
    },
    ftcLimitationRate: 0.37
  }
};

export function getYearConfig(year: number): YearConfig {
  const key = String(year);
  if (!yearConfigs[key]) {
    throw new Error(`Missing year config for ${year}`);
  }
  return yearConfigs[key];
}
