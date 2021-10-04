import { FunctionComponent, createContext } from 'preact';
import {
  I18nLanguage,
  I18nTranslation,
  reconcileLanguage,
  translations,
} from '../i18n/main.js';
import { useContext, useMemo } from 'preact/hooks';
import { getLanguage } from '../util/locale.js';
import { useFlags } from './flags.js';

type TI18nContext = {
  language: I18nLanguage;
  translation: I18nTranslation;
};

const I18nContext = createContext<TI18nContext>(
  null as unknown as TI18nContext
);

export const I18nProvider: FunctionComponent = ({ children }) => {
  const { language: languageOverride } = useFlags();

  const language = useMemo(
    () => languageOverride || reconcileLanguage(getLanguage()),
    [languageOverride]
  );

  const translation = useMemo(() => translations[language], [language]);

  return (
    <I18nContext.Provider value={{ language, translation }}>
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n(): I18nTranslation {
  return useContext(I18nContext).translation;
}

export function useI18nLanguage(): I18nLanguage {
  return useContext(I18nContext).language;
}
