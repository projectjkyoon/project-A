"use client";

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { WizardProgress } from '@/components/wizard-progress';
import { DisclaimerBanner } from '@expat/ui';

const steps = ['welcome', 'residency', 'personal', 'income', 'deductions', 'foreign', 'review'];

export default function LandingPage() {
  const t = useTranslations('landing');

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 p-6">
      <header className="rounded-lg bg-white p-6 shadow">
        <h1 className="text-3xl font-semibold">{t('title')}</h1>
        <p className="mt-4 text-lg text-slate-600">{t('subtitle')}</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link
            className="rounded-md bg-indigo-600 px-4 py-2 text-center text-white shadow hover:bg-indigo-500"
            href="./wizard/welcome"
          >
            {t('getStarted')}
          </Link>
          <Link className="rounded-md border border-indigo-200 px-4 py-2 text-center text-indigo-600" href="/docs">
            {t('viewDocs')}
          </Link>
        </div>
        <p className="mt-4 text-sm text-slate-500">{t('disclaimer')}</p>
      </header>
      <section className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-xl font-semibold">{t('wizardPreview')}</h2>
        <WizardProgress steps={steps} currentStepIndex={0} />
        <p className="mt-4 text-sm text-slate-600">{t('wizardDescription')}</p>
        <DisclaimerBanner>
          {t('disclaimer')}
        </DisclaimerBanner>
      </section>
    </main>
  );
}
