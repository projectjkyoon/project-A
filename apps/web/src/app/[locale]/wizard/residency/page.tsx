'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useMutation } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';
import type { ResidencyFormValues } from '@/types/forms';
import { residencySchema } from '@/types/forms';

interface ResidencyResponse {
  residencyStatus: string;
  feieEligible: boolean;
  recommendedForm: '1040' | '1040-NR';
  rationale: string[];
}

export default function ResidencyStep() {
  const t = useTranslations('wizard.residency');
  const router = useRouter();
  const form = useForm<ResidencyFormValues>({
    resolver: zodResolver(residencySchema),
    defaultValues: {
      taxYear: new Date().getFullYear(),
      daysInUS: 0,
      hasGreenCard: false,
      visaStatus: 'F-1',
      isDualStatus: false,
      physicalPresenceDaysAbroad: 330,
      bonaFideResidence: true
    }
  });

  const mutation = useMutation<ResidencyResponse, Error, ResidencyFormValues>({
    mutationFn: (values) => apiClient.post('/residency/determine', values)
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await mutation.mutateAsync(values);
    sessionStorage.setItem('residencyResult', JSON.stringify(result));
    router.push('../personal');
  });

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <Card title={t('title')} description={t('description')}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col text-sm font-medium text-slate-700">
            {t('fields.taxYear')}
            <input type="number" className="mt-1 rounded border px-3 py-2" {...form.register('taxYear', { valueAsNumber: true })} />
            {form.formState.errors.taxYear ? <span className="text-sm text-red-600">{form.formState.errors.taxYear.message}</span> : null}
          </label>
          <label className="flex flex-col text-sm font-medium text-slate-700">
            {t('fields.daysInUS')}
            <input type="number" className="mt-1 rounded border px-3 py-2" {...form.register('daysInUS', { valueAsNumber: true })} />
          </label>
          <label className="flex flex-col text-sm font-medium text-slate-700">
            {t('fields.hasGreenCard')}
            <input type="checkbox" className="mt-2 h-4 w-4" {...form.register('hasGreenCard')} />
          </label>
          <label className="flex flex-col text-sm font-medium text-slate-700">
            {t('fields.visaStatus')}
            <input type="text" className="mt-1 rounded border px-3 py-2" {...form.register('visaStatus')} />
          </label>
          <label className="flex flex-col text-sm font-medium text-slate-700">
            {t('fields.physicalPresenceDaysAbroad')}
            <input
              type="number"
              className="mt-1 rounded border px-3 py-2"
              {...form.register('physicalPresenceDaysAbroad', { valueAsNumber: true })}
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input type="checkbox" className="h-4 w-4" {...form.register('bonaFideResidence')} />
            {t('fields.bonaFideResidence')}
          </label>
        </div>
      </Card>
      <button
        type="submit"
        className="rounded-md bg-indigo-600 px-4 py-2 text-white shadow disabled:cursor-not-allowed disabled:opacity-50"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? t('submitting') : t('continue')}
      </button>
      {mutation.isError ? <p className="text-sm text-red-600">{mutation.error.message}</p> : null}
      {mutation.data ? (
        <Card title={t('result.title')}>
          <p className="text-sm">
            {t('result.residencyStatus', { status: mutation.data.residencyStatus })}
          </p>
          <p className="text-sm">
            {t('result.recommendedForm', { form: mutation.data.recommendedForm })}
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
            {mutation.data.rationale.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </Card>
      ) : null}
    </form>
  );
}
