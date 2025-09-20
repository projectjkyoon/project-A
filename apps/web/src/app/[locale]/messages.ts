import en from '@/i18n/en.json';
import ko from '@/i18n/ko.json';

const messages = { en, ko } as const;

export default function getMessages(locale: string) {
  return messages[locale as keyof typeof messages] ?? messages.en;
}
