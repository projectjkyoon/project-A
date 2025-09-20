'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';

export default function WelcomeStep() {
  const t = useTranslations('wizard.welcome');

  return (
    <div className="space-y-6">
      <Card title={t('title')} description={t('description')}>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>{t('bullets.guidedFlow')}</li>
          <li>{t('bullets.koreaFocus')}</li>
          <li>{t('bullets.disclaimer')}</li>
        </ul>
      </Card>
      <div className="flex justify-end gap-3">
        <Link className="rounded-md bg-indigo-600 px-4 py-2 text-white" href="../residency">
          {t('start')}
        </Link>
      </div>
    </div>
  );
}
