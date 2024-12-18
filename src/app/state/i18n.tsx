import { createContext, FunctionComponent } from 'preact';
import { useContext, useMemo } from 'preact/hooks';

import { useHookDebug } from '../hooks/use-hook-debug.js';
import {
  I18nLanguage,
  I18nNonCapitalization,
  I18nTranslation,
  nonCapitalizations,
  reconcileLanguage,
  translations,
} from '../i18n/main.js';
import { universal } from '../i18n/universal.js';
import { $flags } from '../util/flags.js';
import { getCountry, getLanguage } from '../util/locale.js';
import { capitalize as capitalizeUtil } from '../util/string.js';

type TI18nContext = {
  country: string | null;
  language: string;
  locale: string | null;
  nonCapitalization: I18nNonCapitalization;
  translation: I18nTranslation;
  translationLanguage: I18nLanguage;
  translationLocale: string | null;
};

const I18nContext = createContext<TI18nContext>(
  null as unknown as TI18nContext,
);

export const I18nProvider: FunctionComponent = ({ children }) => {
  useHookDebug('I18nProvider');

  const languageOverride = $flags.language.value;

  const country = useMemo(() => getCountry(), []);
  const language = useMemo(() => getLanguage(), []);

  const translationLanguage = useMemo(
    () => reconcileLanguage(languageOverride || language),
    [language, languageOverride],
  );

  const locale = useMemo(
    () => (country ? `${language}-${country}` : null),
    [country, language],
  );

  const translationLocale = useMemo(
    () => (country ? `${translationLanguage}-${country}` : null),
    [country, translationLanguage],
  );

  const translation = useMemo(
    () => ({ ...universal, ...translations[translationLanguage] }),
    [translationLanguage],
  );

  const nonCapitalization = useMemo(
    () => nonCapitalizations[translationLanguage],
    [translationLanguage],
  );

  const value = useMemo(
    () => ({
      country,
      language,
      locale,
      nonCapitalization,
      translation,
      translationLanguage,
      translationLocale,
    }),
    [
      country,
      language,
      locale,
      nonCapitalization,
      translation,
      translationLanguage,
      translationLocale,
    ],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): TI18nContext => useContext(I18nContext);

export const useI18nKey = <F extends boolean>(
  key?: keyof I18nTranslation | string,
  fallback?: F,
): F extends true ? string : string | undefined => {
  const { translation } = useContext(I18nContext);

  const result = useMemo(() => {
    if (!key || !(key in translation)) return undefined;

    return translation[key as unknown as keyof I18nTranslation];
  }, [key, translation]);

  return useMemo(() => {
    if (result) return result;

    if (fallback) {
      if (key) return `<${key}>`;
      return '<[empty]>';
    }

    return undefined;
  }, [fallback, key, result]) as F extends true ? string : string | undefined;
};

export const useI18nNonCapitalization = (): string[] => {
  const { nonCapitalization } = useContext(I18nContext);

  return useMemo(
    () => nonCapitalization,
    [nonCapitalization],
  ) as unknown as string[];
};

export const useI18nKeyFallback = (
  key?: keyof I18nTranslation | string,
): string => useI18nKey(key, true);

export const useCapitalization = (
  text: string | undefined,
): string | undefined => {
  const nonCapitalization = useI18nNonCapitalization();

  const textWords = useMemo(() => (text ? text.split(' ') : undefined), [text]);

  return useMemo(() => {
    if (!textWords) return undefined;

    return textWords
      .map((word) =>
        nonCapitalization.includes(word) ? word : capitalizeUtil(word),
      )
      .join(' ');
  }, [nonCapitalization, textWords]);
};

export const Capitalize: FunctionComponent<{ text: string }> = ({ text }) => (
  <>{useCapitalization(text)}</>
);

export const Translation: FunctionComponent<{
  capitalize?: boolean;
  fallback?: boolean;
  i18nKey?: keyof I18nTranslation | string;
}> = ({ capitalize, fallback = true, i18nKey }) => {
  const translation = useI18nKey(i18nKey, fallback);

  const result = useMemo(() => {
    if (capitalize && translation) {
      return <Capitalize text={translation} />;
    }

    return translation;
  }, [capitalize, translation]);

  return <>{result ?? null}</>;
};
