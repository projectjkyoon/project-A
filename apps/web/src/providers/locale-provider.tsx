'use client';

import { createContext, ReactNode, useContext } from 'react';
import { useLocale } from 'next-intl';

const LocaleContext = createContext<string>('en');

export function LocaleProvider({ children, locale }: { children: ReactNode; locale?: string }) {
  const currentLocale = locale ?? useLocale();
  return <LocaleContext.Provider value={currentLocale}>{children}</LocaleContext.Provider>;
}

export function useCurrentLocale() {
  return useContext(LocaleContext);
}
