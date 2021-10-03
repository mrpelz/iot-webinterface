import { en } from './en.js';

const defaultTranslation = en;

const additionalTranslations = {};

export const translations = {
  en,
  ...additionalTranslations,
};

export const i18nLanguages = Object.keys(
  translations
) as unknown as keyof typeof translations;

export type I18nLanguages = typeof i18nLanguages;

export type I18nKeys = keyof typeof defaultTranslation;

export type I18nTranslations = Record<I18nKeys, string>;

export function reconcileLanguage(input: string): I18nLanguages | null {
  if (i18nLanguages.includes(input)) {
    return input as unknown as I18nLanguages;
  }

  return null;
}
