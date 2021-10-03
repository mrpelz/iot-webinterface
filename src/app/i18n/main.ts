import { en } from './en.js';

export const translations = {
  en,
};

export const i18nLanguages = Object.keys(
  translations
) as unknown as keyof typeof translations;

export type I18nLanguages = typeof i18nLanguages;

export type I18nKeys = keyof typeof en;
