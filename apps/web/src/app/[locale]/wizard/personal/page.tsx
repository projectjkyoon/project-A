'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';

interface PersonalForm {
  firstName: string;
  lastName: string;
  ssn: string;
  filingStatus: string;
  dependents: number;
}

export default function PersonalStep() {
  const t = useTranslations('wizard.personal');
  const router = useRouter();
  const { register, handleSubmit } = useForm<PersonalForm>({
    defaultValues: {
      filingStatus: 'single',
      dependents: 0
    }
  });

  const mutation = useMutation<{ id: string }, Error, { filingStatus: string}>({
    mutationFn: (payload) => {
      const residency = sessionStorage.getItem('residencyResult');
      const residencyParsed = residency ? JSON.parse(residency) : null;
      return apiClient.post<{ id: string }>('/returns', {
        userId: 'demo-user',
        taxYear: new Date().getFullYear(),
        residencyStatus: residencyParsed?.residencyStatus ?? 'us-resident',
        filingStatus: payload.filingStatus,
        country: 'KOR'
      });
    }
  });

  const onSubmit = handleSubmit((values) => {
    sessionStorage.setItem('personalInfo', JSON.stringify(values));
    mutation
      .mutateAsync({ filingStatus: values.filingStatus })
      .then((data) => {
        sessionStorage.setItem('returnId', data.id);
        router.push('../income');
      })
      .catch(() => {
        // eslint-disable-next-line no-alert
        alert('Failed to create return.');
      });
  });

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <Card title={t('title')} description={t('description')}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col text-sm font-medium text-slate-700">
            {t('fields.firstName')}
            <input type="text" className="mt-1 rounded border px-3 py-2" {...register('firstName', { required: true })} />
          </label>
          <label className="flex flex-col text-sm font-medium text-slate-700">
            {t('fields.lastName')}
            <input type="text" className="mt-1 rounded border px-3 py-2" {...register('lastName', { required: true })} />
          </label>
          <label className="flex flex-col text-sm font-medium text-slate-700">
            {t('fields.ssn')}
            <input type="text" className="mt-1 rounded border px-3 py-2" {...register('ssn', { required: true })} />
          </label>
          <label className="flex flex-col text-sm font-medium text-slate-700">
            {t('fields.filingStatus')}
            <select className="mt-1 rounded border px-3 py-2" {...register('filingStatus')}>
              <option value="single">{t('filingStatuses.single')}</option>
              <option value="mfj">{t('filingStatuses.mfj')}</option>
              <option value="mfs">{t('filingStatuses.mfs')}</option>
              <option value="hoh">{t('filingStatuses.hoh')}</option>
            </select>
          </label>
          <label className="flex flex-col text-sm font-medium text-slate-700">
            {t('fields.dependents')}
            <input type="number" className="mt-1 rounded border px-3 py-2" {...register('dependents', { valueAsNumber: true })} />
          </label>
        </div>
      </Card>
      <div className="flex justify-between">
        <button type="button" className="rounded-md border border-slate-200 px-4 py-2" onClick={() => router.back()}>
          {t('back')}
        </button>
        <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-white" disabled={mutation.isPending}>
          {mutation.isPending ? '...' : t('continue')}
        </button>
      </div>
    </form>
  );
}
