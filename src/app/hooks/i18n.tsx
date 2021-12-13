import { FunctionComponent, createContext } from 'preact';
import {
  I18nLanguage,
  I18nTranslation,
  reconcileLanguage,
  translations,
} from '../i18n/main.js';
import { Locale, getLocale } from '../util/locale.js';
import { useContext, useMemo } from 'preact/hooks';
import { useFlags } from './flags.js';
import { useHookDebug } from '../util/hook-debug.js';

type TI18nContext = {
  translation: I18nTranslation;
  translationLanguage: I18nLanguage;
} & Locale;

const I18nContext = createContext<TI18nContext>(
  null as unknown as TI18nContext
);

export const I18nProvider: FunctionComponent = ({ children }) => {
  useHookDebug('I18nProvider');

  const { language: languageOverride } = useFlags();

  const { country, language, locale } = useMemo(() => getLocale(), []);

  const translationLanguage = useMemo(
    () => reconcileLanguage(languageOverride || language),
    [language, languageOverride]
  );

  const translation = useMemo(
    () => translations[translationLanguage],
    [translationLanguage]
  );

  const value = useMemo(
    () => ({ country, language, locale, translation, translationLanguage }),
    [country, language, locale, translation, translationLanguage]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): TI18nContext => {
  return useContext(I18nContext);
};

export const useI18nKey = (key?: string): string => {
  const { translation } = useContext(I18nContext);

  return useMemo(() => {
    if (!key) return '<[empty]>';

    if (key in translation) {
      return translation[key as unknown as keyof I18nTranslation];
    }

    return `<${key}>`;
  }, [key, translation]);
};

export const Translation: FunctionComponent<{ i18nKey?: string }> = ({
  i18nKey,
}) => {
  const translation = useI18nKey(i18nKey);

  return <>{translation}</>;
};
