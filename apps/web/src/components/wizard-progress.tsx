'use client';

import clsx from 'classnames';

interface WizardProgressProps {
  steps: string[];
  currentStepIndex?: number;
}

export function WizardProgress({ steps, currentStepIndex = 0 }: WizardProgressProps) {
  return (
    <ol className="flex flex-wrap items-center gap-4" aria-label="Wizard steps">
      {steps.map((step, index) => (
        <li key={step} className="flex items-center gap-2 text-sm uppercase tracking-wide">
          <span
            className={clsx('flex h-8 w-8 items-center justify-center rounded-full border text-xs', {
              'border-indigo-600 bg-indigo-600 text-white': index <= currentStepIndex,
              'border-slate-200 text-slate-500': index > currentStepIndex
            })}
          >
            {index + 1}
          </span>
          <span className={clsx({ 'text-indigo-700': index <= currentStepIndex, 'text-slate-500': index > currentStepIndex })}>
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
}
