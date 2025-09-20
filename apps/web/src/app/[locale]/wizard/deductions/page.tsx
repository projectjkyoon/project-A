'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';

export default function DeductionsStep() {
  const t = useTranslations('wizard.income');
  const router = useRouter();

  return (
    <div className="space-y-6">
      <Card title="Deductions" description="Standard vs itemized deduction selection.">
        <p className="text-sm text-slate-600">Detailed deduction entry is coming soon. For the MVP we assume standard deduction.</p>
      </Card>
      <div className="flex justify-between">
        <button type="button" className="rounded-md border border-slate-200 px-4 py-2" onClick={() => router.back()}>
          {t('back')}
        </button>
        <button type="button" className="rounded-md bg-indigo-600 px-4 py-2 text-white" onClick={() => router.push('../foreign')}>
          {t('continue')}
        </button>
      </div>
    </div>
  );
}
