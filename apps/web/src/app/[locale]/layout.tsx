import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import getMessages from './messages';
import { QueryProvider } from '@/providers/query-provider';
import { LocaleProvider } from '@/providers/locale-provider';

const locales = ['en', 'ko'];

export default function LocaleLayout({ children, params }: { children: ReactNode; params: { locale: string } }) {
  if (!locales.includes(params.locale)) {
    notFound();
  }

  const messages = getMessages(params.locale);

  return (
    <NextIntlClientProvider locale={params.locale} messages={messages}>
      <LocaleProvider locale={params.locale}>
        <QueryProvider>{children}</QueryProvider>
      </LocaleProvider>
    </NextIntlClientProvider>
  );
}
