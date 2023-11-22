import { de, deNonCapitalization } from './de.js';
import { en, enNonCapitalization } from './en.js';
import { universal } from './universal.js';

const i18nLanguageDefault = 'en' as const;
export const i18nLanguages = [i18nLanguageDefault, 'de'] as const;

export type I18nLanguage = (typeof i18nLanguages)[number];

export const translations = {
  de,
  en,
};

export const nonCapitalizations = {
  de: deNonCapitalization,
  en: enNonCapitalization,
};

export type I18nKey =
  | keyof (typeof translations)[I18nLanguage]
  | keyof typeof universal;
export type I18nTranslation = Record<I18nKey, string>;

export type I18nNonCapitalization = (typeof nonCapitalizations)[I18nLanguage];

export const reconcileLanguage = (input: string): I18nLanguage => {
  const test = input as unknown as I18nLanguage;

  if (!i18nLanguages.includes(test)) {
    return i18nLanguageDefault;
  }

  return test;
};
