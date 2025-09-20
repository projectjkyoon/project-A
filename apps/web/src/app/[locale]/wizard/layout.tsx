'use client';

import { ReactNode, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { WizardProgress } from '@/components/wizard-progress';

const steps = ['welcome', 'residency', 'personal', 'income', 'deductions', 'foreign', 'review'];

export default function WizardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const currentStepIndex = useMemo(() => {
    const active = steps.findIndex((step) => pathname?.includes(step));
    return active >= 0 ? active : 0;
  }, [pathname]);

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 p-6">
      <WizardProgress steps={steps} currentStepIndex={currentStepIndex} />
      <div className="flex-1 rounded-lg bg-white p-6 shadow">{children}</div>
    </div>
  );
}
