import { FunctionComponent } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';

import { Button, Entry as EntryComponent } from '../../components/list.js';
import { ShowHide } from '../../components/show-hide.js';
import { useArray } from '../../hooks/use-array-compare.js';
import { I18nLanguage, i18nLanguages } from '../../i18n/main.js';
import { useFlag, useSetFlag } from '../../state/flags.js';
import { Translation, useI18nKeyFallback } from '../../state/i18n.js';
import {
  staticPages,
  useNavigationBuilding,
  useNavigationHome,
} from '../../state/navigation.js';
import { Theme, themes } from '../../state/theme.js';
import { useHierarchy, useLevelShallow } from '../../state/web-api.js';
import { removeServiceWorkers } from '../../util/service-worker.js';
import { triggerUpdate } from '../../util/update.js';
import { Entry, List } from '../../views/list.js';
import {
  HierarchyElementBuilding,
  HierarchyElementHome,
  HierarchyElementRoom,
  Levels,
} from '../../web-api.js';

export const Settings: FunctionComponent = () => {
  const hierarchy = useHierarchy();
  const homes = useLevelShallow<HierarchyElementHome>(Levels.HOME, hierarchy);
  const [home, setHome] = useNavigationHome();

  const buildings = useLevelShallow<HierarchyElementBuilding>(
    Levels.BUILDING,
    home,
  );
  const [building, setBuilding] = useNavigationBuilding();

  const rooms = useLevelShallow<HierarchyElementRoom>(Levels.ROOM, hierarchy);
  const roomNames = useArray(
    useMemo(() => rooms.map(({ meta: { name } }) => name), [rooms]),
  );

  const startPages = useMemo(() => [...staticPages, ...roomNames], [roomNames]);

  const startPage = useFlag('startPage');
  const setStartPage = useSetFlag('startPage');

  const theme = useFlag('theme');
  const setTheme = useSetFlag('theme');

  const language = useFlag('language');
  const setLanguage = useSetFlag('language');

  const absoluteTimes = useFlag('absoluteTimes');
  const setAbsoluteTimes = useSetFlag('absoluteTimes');

  const inactivityTimeout = useFlag('inactivityTimeout');
  const setInactivityTimeout = useSetFlag('inactivityTimeout');

  const screensaverEnable = useFlag('screensaverEnable');
  const setScreensaverEnable = useSetFlag('screensaverEnable');

  const screensaverRandomizePosition = useFlag('screensaverRandomizePosition');
  const setScreensaverRandomizePosition = useSetFlag(
    'screensaverRandomizePosition',
  );

  const debug = useFlag('debug');
  const setDebug = useSetFlag('debug');

  const apiBaseUrl = useFlag('apiBaseUrl');
  const setApiBaseUrl = useSetFlag('apiBaseUrl');

  return (
    <>
      <List>
        <Entry
          id="home"
          label={<Translation capitalize={true} i18nKey="home" />}
        >
          <select
            disabled={homes.length < 2}
            id="home"
            name="home"
            onChange={useCallback<JSX.GenericEventHandler<HTMLSelectElement>>(
              ({ currentTarget: { value } }) => {
                const matchingHome = homes.find(
                  ({ meta: { name } }) => name === value,
                );
                if (!matchingHome || matchingHome === home) {
                  return;
                }

                setHome(matchingHome);
              },
              [homes, setHome, home],
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
                  ({ meta: { name } }) => name === value,
                );
                if (!matchingBuilding || matchingBuilding === building) {
                  return;
                }

                setBuilding(matchingBuilding);
              },
              [buildings, setBuilding, building],
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
              [startPages, setStartPage],
            )}
          >
            <option value="auto" selected={startPage === null}>
              <Translation i18nKey="auto" />
            </option>
            <optgroup label={useI18nKeyFallback('staticPage')}>
              {staticPages.map((aStaticPage) => (
                <option
                  value={aStaticPage}
                  selected={aStaticPage === startPage}
                >
                  <Translation i18nKey={aStaticPage} />
                </option>
              ))}
            </optgroup>
            <optgroup label={useI18nKeyFallback('room')}>
              {roomNames.map((aRoom) => (
                <option value={aRoom} selected={aRoom === startPage}>
                  <Translation i18nKey={aRoom} />
                </option>
              ))}
            </optgroup>
          </select>
        </Entry>
      </List>
      <List>
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

                if (
                  !themes.includes(selectedTheme) ||
                  selectedTheme === theme
                ) {
                  return;
                }

                setTheme(selectedTheme);
              },
              [setTheme, theme],
            )}
          >
            <option value="auto" selected={theme === null}>
              <Translation i18nKey="auto" />
            </option>
            {themes.map((aTheme) => (
              <option value={aTheme} selected={aTheme === theme}>
                <Translation i18nKey={aTheme} />
              </option>
            ))}
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
              [language, setLanguage],
            )}
          >
            <option value="auto" selected={language === null}>
              <Translation i18nKey="auto" />
            </option>
            {i18nLanguages.map((aLanguage) => (
              <option value={aLanguage} selected={aLanguage === language}>
                <Translation i18nKey={aLanguage} />
              </option>
            ))}
          </select>
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
              [setAbsoluteTimes],
            )}
          />
        </Entry>
      </List>
      <List>
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
                  10,
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
              [setInactivityTimeout],
            )}
          />
        </Entry>
        <Entry
          id="screensaverEnable"
          label={<Translation capitalize={true} i18nKey="enableScreensaver" />}
        >
          <input
            checked={Boolean(screensaverEnable)}
            id="screensaverEnable"
            name="screensaverEnable"
            type="checkbox"
            onChange={useCallback<JSX.GenericEventHandler<HTMLInputElement>>(
              ({ currentTarget: { checked: selectedScreensaverEnable } }) => {
                setScreensaverEnable(selectedScreensaverEnable);

                if (!selectedScreensaverEnable) {
                  setScreensaverRandomizePosition(false);
                }
              },
              [setScreensaverEnable, setScreensaverRandomizePosition],
            )}
          />
        </Entry>
        <ShowHide show={Boolean(screensaverEnable)}>
          <Entry
            id="screensaverRandomizePosition"
            label={
              <Translation
                capitalize={true}
                i18nKey="randomizeScreensaverPosition"
              />
            }
          >
            <input
              checked={Boolean(screensaverRandomizePosition)}
              id="screensaverRandomizePosition"
              name="screensaverRandomizePosition"
              type="checkbox"
              onChange={useCallback<JSX.GenericEventHandler<HTMLInputElement>>(
                ({
                  currentTarget: {
                    checked: selectedscreensaverRandomizePosition,
                  },
                }) => {
                  setScreensaverRandomizePosition(
                    selectedscreensaverRandomizePosition,
                  );
                },
                [setScreensaverRandomizePosition],
              )}
            />
          </Entry>
        </ShowHide>
      </List>
      <List>
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
              [setDebug],
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
                if (selectedApiBaseUrl.length === 0) {
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
              [setApiBaseUrl],
            )}
          />
        </Entry>
        <EntryComponent>
          <Button onClick={useCallback(() => triggerUpdate?.(), [])}>
            update
          </Button>
          <Button onClick={useCallback(() => location.reload(), [])}>
            reload
          </Button>
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
    </>
  );
};
