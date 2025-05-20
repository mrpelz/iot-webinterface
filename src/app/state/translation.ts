import { computed, ReadonlySignal, Signal, signal } from '@preact/signals';

import {
  I18nTranslation,
  nonCapitalizations,
  reconcileLanguage,
  translations,
} from '../i18n/main.js';
import { universal } from '../i18n/universal.js';
import { $flags } from '../util/flags.js';
import { getCountry, getLanguage } from '../util/locale.js';
import { AnySignal, callbackSignal, isSignal } from '../util/signal.js';
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

export const getTranslation = (
  $key:
    | undefined
    | keyof I18nTranslation
    | string
    | AnySignal<keyof I18nTranslation | string | undefined>,
): ReadonlySignal<string | undefined> =>
  callbackSignal(
    ({ i18n: { translation }, key }) => {
      if (!key || !(key in translation)) return undefined;

      return translation[key as unknown as keyof I18nTranslation];
    },
    {
      i18n: $i18n,
      key: isSignal($key) ? $key : signal($key),
    },
  )();

export const getTranslationFallback = (
  $key:
    | undefined
    | keyof I18nTranslation
    | string
    | AnySignal<keyof I18nTranslation | string | undefined>,
): ReadonlySignal<string> => {
  const $key_ = $key instanceof Signal ? $key : signal($key);
  const $result = getTranslation($key);

  return computed(() => {
    const { value } = $result;

    if (value) return value;
    if ($key_.value) return `<${$key_.value}>`;

    return '<[empty]>';
  });
};

export const getCapitalization = (
  $input: string | undefined | AnySignal<string | undefined>,
): ReadonlySignal<string | undefined> =>
  callbackSignal(
    ({ i18n: { nonCapitalization }, input }) => {
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
      input: isSignal($input) ? $input : signal($input),
    },
  )();
