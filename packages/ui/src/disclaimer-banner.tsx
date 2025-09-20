import { ReactNode } from 'react';
import clsx from 'classnames';

interface DisclaimerBannerProps {
  children: ReactNode;
  variant?: 'info' | 'warning';
}

export function DisclaimerBanner({ children, variant = 'warning' }: DisclaimerBannerProps) {
  return (
    <div
      className={clsx('rounded-md border px-4 py-3 text-sm', {
        'border-amber-300 bg-amber-50 text-amber-900': variant === 'warning',
        'border-sky-200 bg-sky-50 text-sky-900': variant === 'info'
      })}
      role="status"
    >
      {children}
    </div>
  );
}
