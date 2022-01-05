import { de } from './de.js';
import { en } from './en.js';

const i18nLanguageDefault = 'en' as const;
export const i18nLanguages = [i18nLanguageDefault, 'de'] as const;

export type I18nLanguage = typeof i18nLanguages[number];

export const translations = {
  de,
  en,
};

export type I18nKey = keyof typeof translations[I18nLanguage];
export type I18nTranslation = Record<I18nKey, string>;

export function reconcileLanguage(input: string): I18nLanguage {
  const test = input as unknown as I18nLanguage;

  if (!i18nLanguages.includes(test)) {
    return i18nLanguageDefault;
  }

  return test;
}
