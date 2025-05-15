import { computed, ReadonlySignal } from '@preact/signals';

import {
  I18nTranslation,
  nonCapitalizations,
  reconcileLanguage,
  translations,
} from '../i18n/main.js';
import { universal } from '../i18n/universal.js';
import { $flags } from '../util/flags.js';
import { getCountry, getLanguage } from '../util/locale.js';
import { callbackSignal } from '../util/signal.js';
import { capitalize as capitalizeUtil } from '../util/string.js';

const country = getCountry();
const language = getLanguage();

export const $i18n = computed(() => {
  const languageOverride = $flags.language.value;

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

export const getTranslation = callbackSignal(
  ({ i18n: { translation } }, key?: keyof I18nTranslation | string) => {
    if (!key || !(key in translation)) return undefined;

    return translation[key as unknown as keyof I18nTranslation];
  },
  {
    i18n: $i18n,
  },
);

export const getTranslationFallback = (
  key?: keyof I18nTranslation | string,
): ReadonlySignal<string> => {
  const $result = getTranslation(key);

  return computed(() => {
    const { value } = $result;

    if (value) return value;
    if (key) return `<${key}>`;

    return '<[empty]>';
  });
};

export const getCapitalization = callbackSignal(
  ({ i18n: { nonCapitalization } }, input: string | undefined) => {
    const inputWords = input ? input.split(' ') : undefined;
    if (!inputWords) return undefined;

    return inputWords
      .map((word) =>
        (nonCapitalization as unknown as string[]).includes(word)
          ? word
          : capitalizeUtil(word),
      )
      .join(' ');
  },
  {
    i18n: $i18n,
  },
);
