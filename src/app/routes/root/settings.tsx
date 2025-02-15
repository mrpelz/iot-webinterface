/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import {
  excludePattern,
  Level,
  levelObjectMatch,
} from '@iot/iot-monolith/tree';
import { clear } from 'idb-keyval';
import { FunctionComponent, JSX } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';

import { Button, Entry as EntryComponent } from '../../components/list.js';
import { ShowHide } from '../../components/show-hide.js';
import { useArray } from '../../hooks/use-array-compare.js';
import { I18nLanguage, i18nLanguages } from '../../i18n/main.js';
import { useMatch } from '../../state/api.js';
import { Translation, useI18nKeyFallback } from '../../state/i18n.js';
import {
  staticPages,
  useNavigationBuilding,
  useNavigationHome,
} from '../../state/navigation.js';
import { Theme, themes } from '../../state/theme.js';
import { swProxy } from '../../sw.js';
import { $flags } from '../../util/flags.js';
import { Entry, List } from '../../views/list.js';

export const Settings: FunctionComponent = () => {
  // @ts-ignore
  const homes = useMatch(levelObjectMatch[Level.HOME], excludePattern);
  const [home, setHome] = useNavigationHome();

  const buildings = useMatch(levelObjectMatch[Level.BUILDING], excludePattern);
  const [building, setBuilding] = useNavigationBuilding();

  const rooms = useMatch(levelObjectMatch[Level.ROOM], excludePattern);
  const roomNames = useArray(
    useMemo(() => rooms.map((room) => room.$), [rooms]),
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
  const updateUnattended = $flags.updateUnattended.value;
  const updateCheckInterval = $flags.updateCheckInterval.value;

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
                const matchingHome = homes.find((aHome) => aHome.$ === value);
                if (!matchingHome || matchingHome === home) {
                  return;
                }

                setHome(matchingHome);
              },
              [homes, setHome, home],
            )}
          >
            {homes.map((aHome) => (
              <option value={aHome.$} selected={aHome === home}>
                <Translation i18nKey={aHome.$} />
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
                  (aBuilding) => aBuilding.$ === value,
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
              <option value={aBuilding.$} selected={aBuilding === building}>
                <Translation i18nKey={aBuilding.$} />
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

                if (
                  !startPages.includes(
                    selectedOverride as (typeof startPages)[number],
                  )
                ) {
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
            min="5000"
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
      </List>
      <List>
        <Entry
          id="updateUnattended"
          label={<Translation capitalize={true} i18nKey="updateUnattended" />}
        >
          <input
            checked={Boolean(updateUnattended)}
            id="updateUnattended"
            name="updateUnattended"
            type="checkbox"
            onChange={useCallback<
              JSX.GenericEventHandler<HTMLInputElement> & Function
            >(
              ({
                currentTarget: { checked: selectedUpdateUnattended },
              }: JSX.TargetedEvent<HTMLInputElement, Event>) => {
                $flags.updateUnattended.value = selectedUpdateUnattended;
              },
              [],
            )}
          />
        </Entry>
        <Entry
          id="updateCheckInterval"
          label={
            <Translation capitalize={true} i18nKey="updateCheckInterval" />
          }
        >
          <input
            id="updateCheckInterval"
            inputMode="numeric"
            min="500"
            name="updateCheckInterval"
            pattern="[0-9]*"
            placeholder="0"
            value={updateCheckInterval || ''}
            onBlur={useCallback<
              JSX.GenericEventHandler<HTMLInputElement> & Function
            >(
              ({
                currentTarget: { value },
              }: JSX.TargetedEvent<HTMLInputElement, Event>) => {
                const selectedUpdateCheckInterval = Number.parseInt(
                  value.trim(),
                  10,
                );
                if (
                  !selectedUpdateCheckInterval ||
                  Number.isNaN(selectedUpdateCheckInterval) ||
                  !Number.isInteger(selectedUpdateCheckInterval)
                ) {
                  $flags.updateCheckInterval.value = null;
                  return;
                }

                $flags.updateCheckInterval.value = selectedUpdateCheckInterval;
              },
              [],
            )}
          />
        </Entry>
      </List>
      <List>
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
