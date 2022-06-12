import { Button, Entry as EntryComponent } from '../../../components/list.js';
import { Entry, List } from '../../list.js';
import {
  HierarchyElementBuilding,
  HierarchyElementHome,
  HierarchyElementRoom,
  Levels,
} from '../../../web-api.js';
import { I18nLanguage, i18nLanguages } from '../../../i18n/main.js';
import { Theme, themes } from '../../../state/theme.js';
import { Translation, useI18nKeyFallback } from '../../../state/i18n.js';
import { reload, triggerUpdate } from '../../../util/update.js';
import {
  staticPages,
  useNavigationBuilding,
  useNavigationHome,
} from '../../../state/navigation.js';
import { useCallback, useMemo } from 'preact/hooks';
import { useFlag, useSetFlag } from '../../../state/flags.js';
import { useHierarchy, useLevelShallow } from '../../../state/web-api.js';
import { FunctionComponent } from 'preact';
import { removeServiceWorkers } from '../../../util/workers.js';
import { useArray } from '../../../util/use-array-compare.js';

export const Settings: FunctionComponent = () => {
  const hierarchy = useHierarchy();
  const homes = useLevelShallow<HierarchyElementHome>(Levels.HOME, hierarchy);
  const [home, setHome] = useNavigationHome();

  const buildings = useLevelShallow<HierarchyElementBuilding>(
    Levels.BUILDING,
    home
  );
  const [building, setBuilding] = useNavigationBuilding();

  const rooms = useLevelShallow<HierarchyElementRoom>(Levels.ROOM, hierarchy);
  const roomNames = useArray(
    useMemo(() => rooms.map(({ meta: { name } }) => name), [rooms])
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

  const absoluteTimes = useFlag('absoluteTimes');
  const setAbsoluteTimes = useSetFlag('absoluteTimes');

  const inactivityTimeout = useFlag('inactivityTimeout');
  const setInactivityTimeout = useSetFlag('inactivityTimeout');

  const debug = useFlag('debug');
  const setDebug = useSetFlag('debug');

  const updateCheckInterval = useFlag('updateCheckInterval');
  const setAutoReloadCheckInterval = useSetFlag('updateCheckInterval');

  const updateUnattended = useFlag('updateUnattended');
  const setAutoReloadUnattended = useSetFlag('updateUnattended');

  const serviceWorker = useFlag('serviceWorker');
  const setServiceWorker = useSetFlag('serviceWorker');

  const apiBaseUrl = useFlag('apiBaseUrl');
  const setApiBaseUrl = useSetFlag('apiBaseUrl');

  return (
    <List>
      <Entry id="home" label={<Translation capitalize={true} i18nKey="home" />}>
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
      </Entry>
      <Entry
        id="building"
        label={<Translation capitalize={true} i18nKey="building" />}
      >
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
      </Entry>
      <Entry
        id="startPage"
        label={<Translation capitalize={true} i18nKey="startPage" />}
      >
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
      </Entry>
      <Entry
        id="theme"
        label={<Translation capitalize={true} i18nKey="theme" />}
      >
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
      </Entry>
      <Entry
        id="language"
        label={<Translation capitalize={true} i18nKey="language" />}
      >
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
      </Entry>
      <Entry
        id="enableNotifications"
        label={<Translation capitalize={true} i18nKey="enableNotifications" />}
      >
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
      </Entry>
      <Entry
        id="absoluteTimes"
        label={<Translation capitalize={true} i18nKey="absoluteTimes" />}
      >
        <input
          checked={Boolean(absoluteTimes)}
          id="absoluteTimes"
          name="absoluteTimes"
          type="checkbox"
          onChange={useCallback<JSX.GenericEventHandler<HTMLInputElement>>(
            ({ currentTarget: { checked: selectedAbsoluteTimes } }) => {
              setAbsoluteTimes(selectedAbsoluteTimes);
            },
            [setAbsoluteTimes]
          )}
        />
      </Entry>
      <Entry
        id="inactivityTimeout"
        label={<Translation capitalize={true} i18nKey="inactivityTimeout" />}
      >
        <input
          id="inactivityTimeout"
          inputMode="numeric"
          name="inactivityTimeout"
          pattern="[0-9]*"
          placeholder="0"
          value={inactivityTimeout || ''}
          onBlur={useCallback<JSX.GenericEventHandler<HTMLInputElement>>(
            ({ currentTarget: { value } }) => {
              const selectedInactivityTimeout = Number.parseInt(
                value.trim(),
                10
              );
              if (
                !selectedInactivityTimeout ||
                Number.isNaN(selectedInactivityTimeout) ||
                !Number.isInteger(selectedInactivityTimeout)
              ) {
                setInactivityTimeout(null);
                return;
              }

              setInactivityTimeout(selectedInactivityTimeout);
            },
            [setInactivityTimeout]
          )}
        />
      </Entry>
      <Entry
        id="debug"
        label={<Translation capitalize={true} i18nKey="debug" />}
      >
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
      </Entry>
      <Entry
        id="updateCheckInterval"
        label={<Translation capitalize={true} i18nKey="updateCheckInterval" />}
      >
        <input
          id="updateCheckInterval"
          inputMode="numeric"
          name="updateCheckInterval"
          pattern="[0-9]*"
          placeholder={useI18nKeyFallback('auto')}
          value={updateCheckInterval === null ? '' : updateCheckInterval}
          onBlur={useCallback<JSX.GenericEventHandler<HTMLInputElement>>(
            ({ currentTarget: { value } }) => {
              const selectedAutoReloadCheckInterval = Number.parseInt(
                value.trim(),
                10
              );
              if (
                selectedAutoReloadCheckInterval < 0 ||
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
      </Entry>
      <Entry
        id="updateUnattended"
        label={<Translation capitalize={true} i18nKey="updateUnattended" />}
      >
        <input
          checked={Boolean(updateUnattended)}
          id="updateUnattended"
          name="updateUnattended"
          type="checkbox"
          onChange={useCallback<JSX.GenericEventHandler<HTMLInputElement>>(
            ({ currentTarget: { checked: selectedAutoReloadUnattended } }) => {
              setAutoReloadUnattended(selectedAutoReloadUnattended);
            },
            [setAutoReloadUnattended]
          )}
        />
      </Entry>
      <Entry
        id="serviceWorker"
        label={<Translation capitalize={true} i18nKey="serviceWorker" />}
      >
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
      </Entry>
      <Entry
        id="apiBaseUrl"
        label={<Translation capitalize={true} i18nKey="apiBaseUrl" />}
      >
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
      </Entry>
      <EntryComponent>
        <Button onClick={useCallback(() => triggerUpdate?.(), [])}>
          refresh ServiceWorker
        </Button>
        <Button onClick={useCallback(() => reload(), [])}>reload</Button>
        <Button
          onClick={useCallback(() => {
            removeServiceWorkers();
            localStorage.clear();
          }, [])}
        >
          reset persistent storage
        </Button>
      </EntryComponent>
    </List>
  );
};
