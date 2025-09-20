'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { Card } from '@/components/ui/card';

interface IncomeForm {
  wages: { employer: string; amount: number; currency: string }[];
  foreignWages: { country: string; amount: number; currency: string }[];
  businessIncome: number;
}

const defaultCurrency = 'USD';

export default function IncomeStep() {
  const t = useTranslations('wizard.income');
  const router = useRouter();
  const { control, register, handleSubmit } = useForm<IncomeForm>({
    defaultValues: {
      wages: [{ employer: '', amount: 0, currency: defaultCurrency }],
      foreignWages: [{ country: 'KOR', amount: 0, currency: 'KRW' }],
      businessIncome: 0
    }
  });

  const wagesArray = useFieldArray({ control, name: 'wages' });
  const foreignWagesArray = useFieldArray({ control, name: 'foreignWages' });

  const onSubmit = handleSubmit((values) => {
    sessionStorage.setItem('income', JSON.stringify(values));
    // TODO: Persist income entries to the API once endpoints are available.
    router.push('../foreign');
  });

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <Card title={t('wages.title')} description={t('wages.description')}>
        {wagesArray.fields.map((field, index) => (
          <div key={field.id} className="grid gap-4 md:grid-cols-3">
            <input placeholder={t('wages.employer')} className="rounded border px-3 py-2" {...register(`wages.${index}.employer`)} />
            <input
              type="number"
              placeholder={t('wages.amount')}
              className="rounded border px-3 py-2"
              {...register(`wages.${index}.amount`, { valueAsNumber: true })}
            />
            <input placeholder={t('wages.currency')} className="rounded border px-3 py-2" {...register(`wages.${index}.currency`)} />
          </div>
        ))}
        <button type="button" className="rounded border px-3 py-1 text-sm" onClick={() => wagesArray.append({ employer: '', amount: 0, currency: defaultCurrency })}>
          {t('addW2')}
        </button>
      </Card>

      <Card title={t('foreignWages.title')} description={t('foreignWages.description')}>
        {foreignWagesArray.fields.map((field, index) => (
          <div key={field.id} className="grid gap-4 md:grid-cols-3">
            <input placeholder={t('foreignWages.country')} className="rounded border px-3 py-2" {...register(`foreignWages.${index}.country`)} />
            <input
              type="number"
              placeholder={t('foreignWages.amount')}
              className="rounded border px-3 py-2"
              {...register(`foreignWages.${index}.amount`, { valueAsNumber: true })}
            />
            <input
              placeholder={t('foreignWages.currency')}
              className="rounded border px-3 py-2"
              {...register(`foreignWages.${index}.currency`)}
            />
          </div>
        ))}
        <button type="button" className="rounded border px-3 py-1 text-sm" onClick={() => foreignWagesArray.append({ country: '', amount: 0, currency: 'USD' })}>
          {t('addForeignWage')}
        </button>
      </Card>

      <Card title={t('business.title')} description={t('business.description')}>
        <input type="number" className="rounded border px-3 py-2" {...register('businessIncome', { valueAsNumber: true })} />
      </Card>

      <div className="flex justify-between">
        <button type="button" className="rounded-md border border-slate-200 px-4 py-2" onClick={() => router.back()}>
          {t('back')}
        </button>
        <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-white">
          {t('continue')}
        </button>
      </div>
    </form>
  );
}
