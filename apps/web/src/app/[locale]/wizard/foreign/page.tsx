'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';
import { feieSchema, type FeieFormValues } from '@/types/forms';

interface FeieResponse {
  maximumExclusion: number;
  housingExclusion: number;
  qualifies: boolean;
  notes: string[];
}

export default function ForeignStep() {
  const t = useTranslations('wizard.foreign');
  const router = useRouter();
  const form = useForm<FeieFormValues>({
    resolver: zodResolver(feieSchema),
    defaultValues: {
      country: 'KOR',
      foreignEarnedIncome: 0,
      housingCosts: 0,
      taxHome: 'Seoul, Korea',
      qualifiesPhysicalPresence: true,
      qualifiesBonaFide: true
    }
  });

  const mutation = useMutation<FeieResponse, Error, FeieFormValues>({
    mutationFn: (values) => apiClient.post('/feie/evaluate', values)
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await mutation.mutateAsync(values);
    sessionStorage.setItem('feieResult', JSON.stringify(result));
    // TODO: Persist FEIE selections to the API for downstream worksheets.
    router.push('../review');
  });

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <Card title={t('title')} description={t('description')}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col text-sm font-medium text-slate-700">
            {t('fields.country')}
            <input type="text" className="mt-1 rounded border px-3 py-2" {...form.register('country')} />
          </label>
          <label className="flex flex-col text-sm font-medium text-slate-700">
            {t('fields.taxHome')}
            <input type="text" className="mt-1 rounded border px-3 py-2" {...form.register('taxHome')} />
          </label>
          <label className="flex flex-col text-sm font-medium text-slate-700">
            {t('fields.foreignEarnedIncome')}
            <input type="number" className="mt-1 rounded border px-3 py-2" {...form.register('foreignEarnedIncome', { valueAsNumber: true })} />
          </label>
          <label className="flex flex-col text-sm font-medium text-slate-700">
            {t('fields.housingCosts')}
            <input type="number" className="mt-1 rounded border px-3 py-2" {...form.register('housingCosts', { valueAsNumber: true })} />
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input type="checkbox" className="h-4 w-4" {...form.register('qualifiesPhysicalPresence')} />
          {t('fields.qualifiesPhysicalPresence')}
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input type="checkbox" className="h-4 w-4" {...form.register('qualifiesBonaFide')} />
          {t('fields.qualifiesBonaFide')}
        </label>
      </Card>
      <div className="flex justify-between">
        <button type="button" className="rounded-md border border-slate-200 px-4 py-2" onClick={() => router.back()}>
          {t('back')}
        </button>
        <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-white" disabled={mutation.isPending}>
          {mutation.isPending ? t('calculating') : t('continue')}
        </button>
      </div>
      {mutation.data ? (
        <Card title={t('result.title')}>
          <p className="text-sm">{t('result.maximumExclusion', { amount: mutation.data.maximumExclusion.toFixed(2) })}</p>
          <p className="text-sm">{t('result.housingExclusion', { amount: mutation.data.housingExclusion.toFixed(2) })}</p>
          <p className="text-sm text-slate-600">{t('result.qualifies', { qualifies: mutation.data.qualifies ? 'Yes' : 'No' })}</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
            {mutation.data.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </Card>
      ) : null}
    </form>
  );
}
