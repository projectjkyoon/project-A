'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';

interface SummaryResponse {
  agi: number;
  taxableIncome: number;
  taxLiability: number;
  credits: number;
  refund: number;
  balanceDue: number;
}

export default function ReviewStep() {
  const t = useTranslations('wizard.review');
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const returnData = sessionStorage.getItem('returnId');
    if (!returnData) {
      setSummary(null);
      return;
    }

    const compute = async () => {
      setLoading(true);
      const data = await apiClient.post<SummaryResponse>(`/returns/${returnData}/compute`, {});
      setSummary(data);
      setLoading(false);
    };

    compute().catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <Card title={t('title')} description={t('description')}>
        <p className="text-sm text-slate-600">{t('disclaimer')}</p>
      </Card>
      {loading ? <p>{t('loading')}</p> : null}
      {summary ? (
        <Card title={t('summary.title')}>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="font-medium text-slate-700">{t('summary.agi')}</dt>
              <dd className="text-slate-900">${summary.agi.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-700">{t('summary.taxableIncome')}</dt>
              <dd className="text-slate-900">${summary.taxableIncome.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-700">{t('summary.taxLiability')}</dt>
              <dd className="text-slate-900">${summary.taxLiability.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-700">{t('summary.credits')}</dt>
              <dd className="text-slate-900">${summary.credits.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-700">{t('summary.refund')}</dt>
              <dd className="text-slate-900">${summary.refund.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-700">{t('summary.balanceDue')}</dt>
              <dd className="text-slate-900">${summary.balanceDue.toFixed(2)}</dd>
            </div>
          </dl>
        </Card>
      ) : (
        <Card title={t('summary.title')}>
          <p className="text-sm text-slate-600">{t('loading')}</p>
        </Card>
      )}
    </div>
  );
}
