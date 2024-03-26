import { computed } from '@preact/signals';
import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import {
  I18nTranslation,
  nonCapitalizations,
  reconcileLanguage,
  translations,
} from '../i18n/main.js';
import { universal } from '../i18n/universal.js';
import { flags } from '../util/flags.js';
import { getCountry, getLanguage } from '../util/locale.js';
import { getSignal } from '../util/signal.js';
import { capitalize as capitalizeUtil } from '../util/string.js';

const country = getCountry();
const language = getLanguage();

export const $i18n = computed(() => {
  const languageOverride = getSignal(flags.language);

  const translationLanguage = reconcileLanguage(languageOverride || language);

  const locale = country ? `${language}-${country}` : null;

  const translationLocale = country
    ? `${translationLanguage}-${country}`
    : null;

  const translation = { ...universal, ...translations[translationLanguage] };

  const nonCapitalization = nonCapitalizations[translationLanguage];

  return {
    country,
    language,
    locale,
    nonCapitalization,
    translation,
    translationLanguage,
    translationLocale,
  };
});

export const useI18nKey = <F extends boolean>(
  key?: keyof I18nTranslation | string,
  fallback?: F,
): F extends true ? string : string | null => {
  const { translation } = getSignal($i18n);

  const result = useMemo(() => {
    if (!key || !(key in translation)) return null;

    return translation[key as unknown as keyof I18nTranslation];
  }, [key, translation]);

  return useMemo(() => {
    if (result) return result;

    if (fallback) {
      if (key) return `<${key}>`;
      return '<[empty]>';
    }

    return null;
  }, [fallback, key, result]) as F extends true ? string : string | null;
};

export const useI18nNonCapitalization = (): string[] => {
  const { nonCapitalization } = getSignal($i18n);

  return useMemo(
    () => nonCapitalization,
    [nonCapitalization],
  ) as unknown as string[];
};

export const useI18nKeyFallback = (
  key?: keyof I18nTranslation | string,
): string => useI18nKey(key, true);

export const useCapitalization = (text: string | null): string | null => {
  const nonCapitalization = useI18nNonCapitalization();

  const textWords = useMemo(() => (text ? text.split(' ') : null), [text]);

  return useMemo(() => {
    if (!textWords) return null;

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

  return <>{result}</>;
};
