import { FunctionComponent, createContext } from 'preact';
import {
  I18nLanguage,
  I18nTranslation,
  reconcileLanguage,
  translations,
} from '../i18n/main.js';
import { getCountry, getLanguage } from '../util/locale.js';
import { useContext, useMemo } from 'preact/hooks';
import { useFlag } from './flags.js';
import { useHookDebug } from '../util/use-hook-debug.js';

type TI18nContext = {
  country: string | null;
  language: string;
  locale: string | null;
  translation: I18nTranslation;
  translationLanguage: I18nLanguage;
  translationLocale: string | null;
};

const I18nContext = createContext<TI18nContext>(
  null as unknown as TI18nContext
);

export const I18nProvider: FunctionComponent = ({ children }) => {
  useHookDebug('I18nProvider');

  const languageOverride = useFlag('language');

  const country = useMemo(() => getCountry(), []);
  const language = useMemo(() => getLanguage(), []);

  const translationLanguage = useMemo(
    () => reconcileLanguage(languageOverride || language),
    [language, languageOverride]
  );

  const locale = useMemo(
    () => (country ? `${language}-${country}` : null),
    [country, language]
  );

  const translationLocale = useMemo(
    () => (country ? `${translationLanguage}-${country}` : null),
    [country, translationLanguage]
  );

  const translation = useMemo(
    () => translations[translationLanguage],
    [translationLanguage]
  );

  const value = useMemo(
    () => ({
      country,
      language,
      locale,
      translation,
      translationLanguage,
      translationLocale,
    }),
    [
      country,
      language,
      locale,
      translation,
      translationLanguage,
      translationLocale,
    ]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): TI18nContext => {
  return useContext(I18nContext);
};

export const useI18nKey = (
  key?: keyof I18nTranslation | string
): string | null => {
  const { translation } = useContext(I18nContext);

  return useMemo(() => {
    if (!key || !(key in translation)) return null;

    return translation[key as unknown as keyof I18nTranslation];
  }, [key, translation]);
};

export const useI18nKeyFallback = (
  key?: keyof I18nTranslation | string
): string => {
  const translation = useI18nKey(key);

  return useMemo(() => {
    if (translation) return translation;
    if (key) return `<${key}>`;
    return '<[empty]>';
  }, [key, translation]);
};

export const Translation: FunctionComponent<{
  i18nKey?: keyof I18nTranslation | string;
}> = ({ i18nKey }) => {
  const translation = useI18nKey(i18nKey);

  return <>{translation}</>;
};
