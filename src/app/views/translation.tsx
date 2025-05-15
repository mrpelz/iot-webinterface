import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { I18nTranslation } from '../i18n/main.js';
import {
  getCapitalization,
  getTranslation,
  getTranslationFallback,
} from '../state/translation.js';

export const Capitalize: FunctionComponent<{ text: string }> = ({ text }) => (
  <>{getCapitalization(text)}</>
);

export const Translation: FunctionComponent<{
  capitalize?: boolean;
  fallback?: boolean;
  i18nKey?: keyof I18nTranslation | string;
}> = ({ capitalize, fallback = true, i18nKey }) => {
  const $translation = fallback
    ? getTranslationFallback(i18nKey)
    : getTranslation(i18nKey);

  const result = useMemo(() => {
    const translation = $translation.value;

    if (capitalize && translation) {
      return <Capitalize text={translation} />;
    }

    return $translation;
  }, [capitalize, $translation]);

  return <>{result}</>;
};
