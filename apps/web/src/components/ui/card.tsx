'use client';

import { ReactNode } from 'react';
import clsx from 'classnames';

interface CardProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function Card({ title, description, children, className }: CardProps) {
  return (
    <div className={clsx('rounded-lg border border-slate-200 bg-white p-6 shadow-sm', className)}>
      {title ? <h3 className="text-xl font-semibold text-slate-900">{title}</h3> : null}
      {description ? <p className="mt-2 text-sm text-slate-600">{description}</p> : null}
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}
