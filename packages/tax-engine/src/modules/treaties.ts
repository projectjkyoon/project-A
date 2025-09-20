import usKorea from '../data/treaties/us-korea.json';

type TreatyData = typeof usKorea;

const treaties: Record<string, TreatyData> = {
  KOR: usKorea
};

export function getTreaty(countryCode: string): TreatyData | undefined {
  return treaties[countryCode];
}
