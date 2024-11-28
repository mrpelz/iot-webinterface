/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { clear } from 'idb-keyval';
import { FunctionComponent, JSX } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';

import { Button, Entry as EntryComponent } from '../../components/list.js';
import { ShowHide } from '../../components/show-hide.js';
import { useArray } from '../../hooks/use-array-compare.js';
import { I18nLanguage, i18nLanguages } from '../../i18n/main.js';
import { Translation, useI18nKeyFallback } from '../../state/i18n.js';
import {
  staticPages,
  useNavigationBuilding,
  useNavigationHome,
} from '../../state/navigation.js';
import { Theme, themes } from '../../state/theme.js';
import { useHierarchy, useLevelShallow } from '../../state/web-api.js';
import { swProxy } from '../../sw.js';
import { $flags } from '../../util/flags.js';
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

  const startPage = $flags.startPage.value;
  const theme = $flags.theme.value;
  const language = $flags.language.value;
  const absoluteTimes = $flags.absoluteTimes.value;
  const inactivityTimeout = $flags.inactivityTimeout.value;
  const screensaverEnable = $flags.screensaverEnable.value;
  const screensaverRandomizePosition = $flags.screensaverRandomizePosition;
  const debug = $flags.debug.value;
  const apiBaseUrl = $flags.apiBaseUrl.value;

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
            onChange={useCallback<
              JSX.GenericEventHandler<HTMLSelectElement> & Function
            >(
              ({
                currentTarget: { value },
              }: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
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
            onChange={useCallback<
              JSX.GenericEventHandler<HTMLSelectElement> & Function
            >(
              ({
                currentTarget: { value },
              }: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
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
            onChange={useCallback<
              JSX.GenericEventHandler<HTMLSelectElement> & Function
            >(
              ({
                currentTarget: { value },
              }: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
                const selectedOverride = value;
                if (selectedOverride === 'auto') {
                  $flags.startPage.value = null;
                }

                if (!startPages.includes(selectedOverride)) {
                  return;
                }

                $flags.startPage.value = selectedOverride;
              },
              [startPages],
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
            onChange={useCallback<
              JSX.GenericEventHandler<HTMLSelectElement> & Function
            >(
              ({
                currentTarget: { value },
              }: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
                const selectedTheme = value as Theme | 'auto';
                if (selectedTheme === 'auto') {
                  $flags.theme.value = null;
                  return;
                }

                if (
                  !themes.includes(selectedTheme) ||
                  selectedTheme === theme
                ) {
                  return;
                }

                $flags.theme.value = selectedTheme;
              },
              [theme],
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
            onChange={useCallback<
              JSX.GenericEventHandler<HTMLSelectElement> & Function
            >(
              ({
                currentTarget: { value },
              }: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
                const selectedLanguage = value as I18nLanguage | 'auto';
                if (selectedLanguage === 'auto') {
                  $flags.language.value = null;
                  return;
                }

                if (
                  !i18nLanguages.includes(selectedLanguage) ||
                  selectedLanguage === language
                ) {
                  return;
                }

                $flags.language.value = selectedLanguage;
              },
              [language],
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
            onChange={useCallback<
              JSX.GenericEventHandler<HTMLInputElement> & Function
            >(
              ({
                currentTarget: { checked: selectedAbsoluteTimes },
              }: JSX.TargetedEvent<HTMLInputElement, Event>) => {
                $flags.absoluteTimes.value = selectedAbsoluteTimes;
              },
              [],
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
            onBlur={useCallback<
              JSX.GenericEventHandler<HTMLInputElement> & Function
            >(
              ({
                currentTarget: { value },
              }: JSX.TargetedEvent<HTMLInputElement, Event>) => {
                const selectedInactivityTimeout = Number.parseInt(
                  value.trim(),
                  10,
                );
                if (
                  !selectedInactivityTimeout ||
                  Number.isNaN(selectedInactivityTimeout) ||
                  !Number.isInteger(selectedInactivityTimeout)
                ) {
                  $flags.inactivityTimeout.value = null;
                  return;
                }

                $flags.inactivityTimeout.value = selectedInactivityTimeout;
              },
              [],
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
            onChange={useCallback<
              JSX.GenericEventHandler<HTMLInputElement> & Function
            >(
              ({
                currentTarget: { checked: selectedScreensaverEnable },
              }: JSX.TargetedEvent<HTMLInputElement, Event>) => {
                $flags.screensaverEnable.value = selectedScreensaverEnable;

                if (!selectedScreensaverEnable) {
                  $flags.screensaverRandomizePosition.value = false;
                }
              },
              [],
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
              onChange={useCallback<
                JSX.GenericEventHandler<HTMLInputElement> & Function
              >(
                ({
                  currentTarget: {
                    checked: selectedscreensaverRandomizePosition,
                  },
                }: JSX.TargetedEvent<HTMLInputElement, Event>) => {
                  $flags.screensaverRandomizePosition.value =
                    selectedscreensaverRandomizePosition;
                },
                [],
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
            onChange={useCallback<
              JSX.GenericEventHandler<HTMLInputElement> & Function
            >(
              ({
                currentTarget: { checked: selectedDebug },
              }: JSX.TargetedEvent<HTMLInputElement, Event>) => {
                $flags.debug.value = selectedDebug;
              },
              [],
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
            onBlur={useCallback<
              JSX.GenericEventHandler<HTMLInputElement> & Function
            >(
              ({
                currentTarget: { value },
              }: JSX.TargetedEvent<HTMLInputElement, Event>) => {
                const selectedApiBaseUrl = value.trim();
                if (selectedApiBaseUrl.length === 0) {
                  $flags.apiBaseUrl.value = null;
                  return;
                }

                try {
                  const url = new URL(selectedApiBaseUrl);
                  $flags.apiBaseUrl.value = url.href;
                } catch {
                  $flags.apiBaseUrl.value = null;
                }
              },
              [],
            )}
          />
        </Entry>
        <EntryComponent>
          <Button
            onClick={useCallback(() => swProxy?.removeRegistration(), [])}
          >
            update
          </Button>
          <Button onClick={useCallback(() => swProxy?.reload(), [])}>
            reload
          </Button>
          <Button
            onClick={useCallback(() => {
              localStorage.clear();
              clear();
            }, [])}
          >
            reset local storage
          </Button>
        </EntryComponent>
      </List>
    </>
  );
};
