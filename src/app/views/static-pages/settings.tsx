import {
  HierarchyElementBuilding,
  HierarchyElementHome,
  HierarchyElementRoom,
  Levels,
} from '../../web-api.js';
import { I18nLanguage, i18nLanguages } from '../../i18n/main.js';
import { Theme, themes } from '../../hooks/theme.js';
import { Translation, useI18nKeyFallback } from '../../hooks/i18n.js';
import { colors, dimensions } from '../../style.js';
import {
  staticPages,
  useNavigationBuilding,
  useNavigationHome,
} from '../../hooks/navigation.js';
import { useCallback, useMemo } from 'preact/hooks';
import { useFlag, useSetFlag } from '../../hooks/flags.js';
import { useHierarchy, useLevel } from '../../hooks/web-api.js';
import { FunctionComponent } from 'preact';
import { styled } from 'goober';

const SettingsWrapper = styled('ul')`
  list-style: none;
  margin: ${dimensions.fontPadding} auto;
  max-width: max-content;
  padding: 0;

  input,
  label,
  select {
    -moz-user-select: text;
    -ms-user-select: text;
    -webkit-tap-highlight-color: text;
    -webkit-touch-callout: text;
    -webkit-user-select: text;
    user-select: text;
    margin-bottom: auto;
  }
`;

const Section = styled('li')`
  border-bottom: ${dimensions.hairline} solid ${colors.fontSecondary()};
  display: flex;
  font-size: ${dimensions.fontSize};
  gap: 1ch;
  justify-content: space-between;
  padding: ${dimensions.fontPadding} 1ch;

  &:last-of-type {
    border-bottom: none;
  }
`;

export const Settings: FunctionComponent = () => {
  const hierarchy = useHierarchy();
  const homes = useLevel<HierarchyElementHome>(Levels.HOME, hierarchy);
  const [home, setHome] = useNavigationHome();

  const buildings = useLevel<HierarchyElementBuilding>(Levels.BUILDING, home);
  const [building, setBuilding] = useNavigationBuilding();

  const rooms = useLevel<HierarchyElementRoom>(Levels.ROOM, hierarchy);
  const roomNames = useMemo(
    () => rooms.map(({ meta: { name } }) => name),
    [rooms]
  );

  const startPages = useMemo(() => [...staticPages, ...roomNames], [roomNames]);

  const startPage = useFlag('startPage');
  const setStartPage = useSetFlag('startPage');

  const theme = useFlag('theme');
  const setTheme = useSetFlag('theme');

  const language = useFlag('language');
  const setLanguage = useSetFlag('language');

  const enableNotifications = useFlag('enableNotifications');
  const setEnableNotifications = useSetFlag('enableNotifications');

  const debug = useFlag('debug');
  const setDebug = useSetFlag('debug');

  const autoReloadCheckInterval = useFlag('autoReloadCheckInterval');
  const setAutoReloadCheckInterval = useSetFlag('autoReloadCheckInterval');

  const autoReloadUnattended = useFlag('autoReloadUnattended');
  const setAutoReloadUnattended = useSetFlag('autoReloadUnattended');

  const serviceWorker = useFlag('serviceWorker');
  const setServiceWorker = useSetFlag('serviceWorker');

  const apiBaseUrl = useFlag('apiBaseUrl');
  const setApiBaseUrl = useSetFlag('apiBaseUrl');

  return (
    <SettingsWrapper>
      <Section>
        <label for="home">
          <Translation i18nKey="home" />
        </label>
        <select
          disabled={homes.length < 2}
          id="home"
          name="home"
          onChange={useCallback<JSX.GenericEventHandler<HTMLSelectElement>>(
            ({ currentTarget: { value } }) => {
              const matchingHome = homes.find(
                ({ meta: { name } }) => name === value
              );
              if (!matchingHome || matchingHome === home) {
                return;
              }

              setHome(matchingHome);
            },
            [homes, setHome, home]
          )}
        >
          {homes.map((aHome) => (
            <option value={aHome.meta.name} selected={aHome === home}>
              <Translation i18nKey={aHome.meta.name} />
            </option>
          ))}
        </select>
      </Section>
      <Section>
        <label for="building">
          <Translation i18nKey="building" />
        </label>
        <select
          disabled={buildings.length < 2}
          id="building"
          name="building"
          onChange={useCallback<JSX.GenericEventHandler<HTMLSelectElement>>(
            ({ currentTarget: { value } }) => {
              const matchingBuilding = buildings.find(
                ({ meta: { name } }) => name === value
              );
              if (!matchingBuilding || matchingBuilding === building) {
                return;
              }

              setBuilding(matchingBuilding);
            },
            [buildings, setBuilding, building]
          )}
        >
          {buildings.map((aBuilding) => (
            <option
              value={aBuilding.meta.name}
              selected={aBuilding === building}
            >
              <Translation i18nKey={aBuilding.meta.name} />
            </option>
          ))}
        </select>
      </Section>
      <Section>
        <label for="startPage">
          <Translation i18nKey="startPage" />
        </label>
        <select
          id="startPage"
          name="startPage"
          onChange={useCallback<JSX.GenericEventHandler<HTMLSelectElement>>(
            ({ currentTarget: { value } }) => {
              const selectedOverride = value;
              if (selectedOverride === 'auto') {
                setStartPage(null);
              }

              if (!startPages.includes(selectedOverride)) {
                return;
              }

              setStartPage(selectedOverride);
            },
            [startPages, setStartPage]
          )}
        >
          <option value="auto" selected={startPage === null}>
            <Translation i18nKey="auto" />
          </option>
          <optgroup label={useI18nKeyFallback('staticPage')}>
            {staticPages.map((aStaticPage) => {
              return (
                <option
                  value={aStaticPage}
                  selected={aStaticPage === startPage}
                >
                  <Translation i18nKey={aStaticPage} />
                </option>
              );
            })}
          </optgroup>
          <optgroup label={useI18nKeyFallback('room')}>
            {roomNames.map((aRoom) => {
              return (
                <option value={aRoom} selected={aRoom === startPage}>
                  <Translation i18nKey={aRoom} />
                </option>
              );
            })}
          </optgroup>
        </select>
      </Section>
      <Section>
        <label for="theme">
          <Translation i18nKey="theme" />
        </label>
        <select
          id="theme"
          name="theme"
          onChange={useCallback<JSX.GenericEventHandler<HTMLSelectElement>>(
            ({ currentTarget: { value } }) => {
              const selectedTheme = value as Theme | 'auto';
              if (selectedTheme === 'auto') {
                setTheme(null);
                return;
              }

              if (!themes.includes(selectedTheme) || selectedTheme === theme) {
                return;
              }

              setTheme(selectedTheme);
            },
            [setTheme, theme]
          )}
        >
          <option value="auto" selected={theme === null}>
            <Translation i18nKey="auto" />
          </option>
          {themes.map((aTheme) => {
            return (
              <option value={aTheme} selected={aTheme === theme}>
                <Translation i18nKey={aTheme} />
              </option>
            );
          })}
        </select>
      </Section>
      <Section>
        <label for="language">
          <Translation i18nKey="language" />
        </label>
        <select
          id="language"
          name="language"
          onChange={useCallback<JSX.GenericEventHandler<HTMLSelectElement>>(
            ({ currentTarget: { value } }) => {
              const selectedLanguage = value as I18nLanguage | 'auto';
              if (selectedLanguage === 'auto') {
                setLanguage(null);
                return;
              }

              if (
                !i18nLanguages.includes(selectedLanguage) ||
                selectedLanguage === language
              ) {
                return;
              }

              setLanguage(selectedLanguage);
            },
            [language, setLanguage]
          )}
        >
          <option value="auto" selected={language === null}>
            <Translation i18nKey="auto" />
          </option>
          {i18nLanguages.map((aLanguage) => {
            return (
              <option value={aLanguage} selected={aLanguage === language}>
                <Translation i18nKey={aLanguage} />
              </option>
            );
          })}
        </select>
      </Section>
      <Section>
        <label for="enableNotifications">
          <Translation i18nKey="enableNotifications" />
        </label>
        <input
          checked={Boolean(enableNotifications)}
          id="enableNotifications"
          name="enableNotifications"
          type="checkbox"
          onChange={useCallback<JSX.GenericEventHandler<HTMLInputElement>>(
            ({ currentTarget: { checked: selectedEnableNotifications } }) => {
              setEnableNotifications(selectedEnableNotifications);
            },
            [setEnableNotifications]
          )}
        />
      </Section>
      <Section>
        <label for="debug">
          <Translation i18nKey="debug" />
        </label>
        <input
          checked={Boolean(debug)}
          id="debug"
          name="debug"
          type="checkbox"
          onChange={useCallback<JSX.GenericEventHandler<HTMLInputElement>>(
            ({ currentTarget: { checked: selectedDebug } }) => {
              setDebug(selectedDebug);
            },
            [setDebug]
          )}
        />
      </Section>
      <Section>
        <label for="autoReloadCheckInterval">
          <Translation i18nKey="autoReloadCheckInterval" />
        </label>
        <input
          id="autoReloadCheckInterval"
          inputMode="numeric"
          name="autoReloadCheckInterval"
          pattern="[0-9]*"
          placeholder={useI18nKeyFallback('auto')}
          value={autoReloadCheckInterval || ''}
          onBlur={useCallback<JSX.GenericEventHandler<HTMLInputElement>>(
            ({ currentTarget: { value } }) => {
              const selectedAutoReloadCheckInterval = Number.parseInt(
                value.trim(),
                10
              );
              if (
                !selectedAutoReloadCheckInterval ||
                Number.isNaN(selectedAutoReloadCheckInterval) ||
                !Number.isInteger(selectedAutoReloadCheckInterval)
              ) {
                setAutoReloadCheckInterval(null);
                return;
              }

              setAutoReloadCheckInterval(selectedAutoReloadCheckInterval);
            },
            [setAutoReloadCheckInterval]
          )}
        />
      </Section>
      <Section>
        <label for="autoReloadUnattended">
          <Translation i18nKey="autoReloadUnattended" />
        </label>
        <input
          checked={Boolean(autoReloadUnattended)}
          id="autoReloadUnattended"
          name="autoReloadUnattended"
          type="checkbox"
          onChange={useCallback<JSX.GenericEventHandler<HTMLInputElement>>(
            ({ currentTarget: { checked: selectedAutoReloadUnattended } }) => {
              setAutoReloadUnattended(selectedAutoReloadUnattended);
            },
            [setAutoReloadUnattended]
          )}
        />
      </Section>
      <Section>
        <label for="serviceWorker">
          <Translation i18nKey="serviceWorker" />
        </label>
        <input
          checked={Boolean(serviceWorker)}
          id="serviceWorker"
          name="serviceWorker"
          type="checkbox"
          onChange={useCallback<JSX.GenericEventHandler<HTMLInputElement>>(
            ({ currentTarget: { checked: selectedServiceWorker } }) => {
              setServiceWorker(selectedServiceWorker);
            },
            [setServiceWorker]
          )}
        />
      </Section>
      <Section>
        <label for="apiBaseUrl">
          <Translation i18nKey="apiBaseUrl" />
        </label>
        <input
          id="apiBaseUrl"
          name="apiBaseUrl"
          placeholder={useI18nKeyFallback('auto')}
          type="url"
          value={apiBaseUrl || ''}
          onBlur={useCallback<JSX.GenericEventHandler<HTMLInputElement>>(
            ({ currentTarget: { value } }) => {
              const selectedApiBaseUrl = value.trim();
              if (!selectedApiBaseUrl.length) {
                setApiBaseUrl(null);
                return;
              }

              try {
                const url = new URL(selectedApiBaseUrl);
                setApiBaseUrl(url.href);
              } catch {
                setApiBaseUrl(null);
              }
            },
            [setApiBaseUrl]
          )}
        />
      </Section>
    </SettingsWrapper>
  );
};
