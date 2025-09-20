import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { computeReturn } from '@expat/tax-engine';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@expat.tax' },
    create: { email: 'demo@expat.tax', name: 'Demo User', locale: 'en', countryOfResidence: 'KOR' },
    update: {}
  });

  const taxReturn = await prisma.return.create({
    data: {
      userId: user.id,
      taxYear: 2023,
      residencyStatus: 'us-resident',
      filingStatus: 'single',
      country: 'KOR',
      incomeForeign: {
        create: {
          employer: 'Seoul Startup',
          amountUSD: 90000,
          currency: 'USD'
        }
      },
      foreignTaxes: {
        create: {
          country: 'KOR',
          basket: 'general',
          amountLocal: 12000000,
          amountUSD: 9500,
          taxYear: 2023
        }
      }
    },
    include: {
      incomeForeign: true,
      foreignTaxes: true
    }
  });

  const computation = computeReturn({
    taxYear: taxReturn.taxYear,
    filingStatus: 'single',
    incomeEntries: taxReturn.incomeForeign.map((item) => ({
      type: 'foreign-wage' as const,
      amount: item.amountUSD,
      currency: 'USD',
      taxYear: taxReturn.taxYear
    })),
    ftc: {
      taxYear: taxReturn.taxYear,
      taxableIncome: taxReturn.incomeForeign.reduce((sum, item) => sum + item.amountUSD, 0),
      usTaxBeforeCredits: 0,
      foreignSourceTaxableIncome: taxReturn.incomeForeign.reduce((sum, item) => sum + item.amountUSD, 0),
      foreignTaxesPaid: taxReturn.foreignTaxes.reduce((sum, item) => sum + item.amountUSD, 0),
      basket: 'general'
    }
  });

  await prisma.computation.create({
    data: {
      returnId: taxReturn.id,
      module: 'tax-engine',
      payloadJSON: {},
      resultJSON: computation
    }
  });

  // eslint-disable-next-line no-console
  console.log('Seed complete');
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
