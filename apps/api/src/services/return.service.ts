import { prisma } from '../lib/prisma';
import { computeReturn, TaxComputationResult, TaxComputationInput } from '@expat/tax-engine';

export async function createReturn(payload: {
  userId: string;
  taxYear: number;
  residencyStatus: string;
  filingStatus: string;
  country: string;
}) {
  return prisma.return.create({
    data: payload
  });
}

export async function getReturn(id: string) {
  return prisma.return.findUnique({
    where: { id },
    include: {
      incomeW2: true,
      income1099: true,
      incomeForeign: true,
      incomeBusiness: true,
      incomePassive: true,
      foreignTaxes: true,
      presenceDays: true
    }
  });
}

export async function computeReturnForId(id: string): Promise<TaxComputationResult> {
  const taxReturn = await getReturn(id);
  if (!taxReturn) {
    throw new Error('Return not found');
  }

  const incomeEntries = [
    ...taxReturn.incomeW2.map((item) => ({ type: 'w2' as const, amount: item.wagesUSD, taxYear: taxReturn.taxYear, currency: 'USD' })),
    ...taxReturn.incomeForeign.map((item) => ({ type: 'foreign-wage' as const, amount: item.amountUSD, taxYear: taxReturn.taxYear, currency: 'USD' })),
    ...taxReturn.incomeBusiness.map((item) => ({ type: 'business' as const, amount: item.netProfit, taxYear: taxReturn.taxYear, currency: 'USD' })),
    ...taxReturn.incomePassive.map((item) => ({ type: 'passive' as const, amount: item.amountUSD, taxYear: taxReturn.taxYear, currency: 'USD' }))
  ];

  const ftc = taxReturn.foreignTaxes[0]
    ? {
        taxYear: taxReturn.taxYear,
        taxableIncome: taxReturn.incomeForeign.reduce((sum, item) => sum + item.amountUSD, 0),
        usTaxBeforeCredits:
          taxReturn.incomeForeign.reduce((sum, item) => sum + item.amountUSD, 0) * 0.22,
        foreignSourceTaxableIncome: taxReturn.incomeForeign.reduce((sum, item) => sum + item.amountUSD, 0),
        foreignTaxesPaid: taxReturn.foreignTaxes.reduce((sum, item) => sum + item.amountUSD, 0),
        basket: 'general' as const
      }
    : undefined;

  const input: TaxComputationInput = {
    taxYear: taxReturn.taxYear,
    filingStatus: taxReturn.filingStatus as TaxComputationInput['filingStatus'],
    incomeEntries,
    ftc
  };

  const result = computeReturn(input);

  await prisma.computation.create({
    data: {
      returnId: id,
      module: 'tax-engine',
      payloadJSON: input,
      resultJSON: result
    }
  });

  return result;
}
