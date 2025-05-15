import { clear } from 'idb-keyval';
import { FunctionComponent, JSX } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';

import { Button, Entry as EntryComponent } from '../../components/list.js';
import { ShowHide } from '../../components/show-hide.js';
import { useArray } from '../../hooks/use-array-compare.js';
import { I18nLanguage, i18nLanguages } from '../../i18n/main.js';
import {
  $building,
  $buildings,
  $home,
  $homes,
  $rooms,
  setBuildingName,
  setHomeName,
  staticPages,
} from '../../state/navigation.js';
import { $theme, Theme, themes } from '../../state/theme.js';
import { getTranslationFallback } from '../../state/translation.js';
import { swProxy } from '../../sw.js';
import { $flags } from '../../util/flags.js';
import { Entry, List } from '../../views/list.js';
import { Translation } from '../../views/translation.js';

const $staticPageLabel = getTranslationFallback('staticPage');
const $roomLabel = getTranslationFallback('room');
const $autoLabel = getTranslationFallback('auto');

export const Settings: FunctionComponent = () => {
  const rooms = $rooms.value;
  const roomNames = useArray(
    useMemo(() => (rooms ? rooms.map((room) => room.$) : []), [rooms]),
  );

  const startPages = useMemo(() => [...staticPages, ...roomNames], [roomNames]);

  return (
    <>
      <List>
        <Entry
          id="home"
          label={<Translation capitalize={true} i18nKey="home" />}
        >
          <select
            disabled={!$homes.value || $homes.value.length <= 1}
            id="home"
            name="home"
            onChange={useCallback<JSX.GenericEventHandler<HTMLSelectElement>>(
              ({
                currentTarget: { value },
              }: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
                const matchingHome = $homes.value?.find(
                  (home) => home.$ === value,
                );

                if (!matchingHome || matchingHome === $home.value) {
                  return;
                }

                setHomeName?.(matchingHome.$);
              },
              [],
            )}
          >
            {$homes.value?.map((home) => (
              <option value={home.$} selected={home === $home.value}>
                <Translation i18nKey={home.$} />
              </option>
            )) ?? null}
          </select>
        </Entry>
        <Entry
          id="building"
          label={<Translation capitalize={true} i18nKey="building" />}
        >
          <select
            disabled={!$buildings.value || $buildings.value.length <= 1}
            id="building"
            name="building"
            onChange={useCallback<JSX.GenericEventHandler<HTMLSelectElement>>(
              ({
                currentTarget: { value },
              }: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
                const matchingBuilding = $buildings.value?.find(
                  (building) => building.$ === value,
                );
                if (!matchingBuilding || matchingBuilding === $building.value) {
                  return;
                }

                setBuildingName?.(matchingBuilding.$);
              },
              [],
            )}
          >
            {$buildings.value?.map((building) => (
              <option
                value={building.$}
                selected={building === $building.value}
              >
                <Translation i18nKey={building.$} />
              </option>
            )) ?? null}
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
            <option value="auto" selected={$flags.startPage.value === null}>
              <Translation i18nKey="auto" />
            </option>
            <optgroup label={$staticPageLabel}>
              {staticPages.map((staticPage) => (
                <option
                  value={staticPage}
                  selected={staticPage === $flags.startPage.value}
                >
                  <Translation i18nKey={staticPage} />
                </option>
              ))}
            </optgroup>
            <optgroup label={$roomLabel}>
              {roomNames.map((room) => (
                <option value={room} selected={room === $flags.startPage.value}>
                  <Translation i18nKey={room} />
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
              ({
                currentTarget: { value },
              }: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
                const theme = value as Theme | 'auto';
                if (theme === 'auto') {
                  $flags.theme.value = null;
                  return;
                }

                if (!themes.includes(theme) || theme === $theme.value) {
                  return;
                }

                $flags.theme.value = theme;
              },
              [],
            )}
          >
            <option value="auto" selected={$flags.theme.value === null}>
              <Translation i18nKey="auto" />
            </option>
            {themes.map((theme) => (
              <option value={theme} selected={theme === $flags.theme.value}>
                <Translation i18nKey={theme} />
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
              ({
                currentTarget: { value },
              }: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
                const language = value as I18nLanguage | 'auto';
                if (language === 'auto') {
                  $flags.language.value = null;
                  return;
                }

                if (
                  !i18nLanguages.includes(language) ||
                  language === $flags.language.value
                ) {
                  return;
                }

                $flags.language.value = language;
              },
              [],
            )}
          >
            <option value="auto" selected={$flags.language.value === null}>
              <Translation i18nKey="auto" />
            </option>
            {i18nLanguages.map((language) => (
              <option
                value={language}
                selected={language === $flags.language.value}
              >
                <Translation i18nKey={language} />
              </option>
            ))}
          </select>
        </Entry>
        <Entry
          id="absoluteTimes"
          label={<Translation capitalize={true} i18nKey="absoluteTimes" />}
        >
          <input
            checked={Boolean($flags.absoluteTimes.value)}
            id="absoluteTimes"
            name="absoluteTimes"
            type="checkbox"
            onChange={useCallback<JSX.GenericEventHandler<HTMLInputElement>>(
              ({ currentTarget: { checked } }) => {
                $flags.absoluteTimes.value = checked;
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
            value={$flags.inactivityTimeout.value || ''}
            onBlur={useCallback<JSX.GenericEventHandler<HTMLInputElement>>(
              ({
                currentTarget: { value },
              }: JSX.TargetedEvent<HTMLInputElement, Event>) => {
                const inactivityTimeout = Number.parseInt(value.trim(), 10);
                if (
                  !inactivityTimeout ||
                  Number.isNaN(inactivityTimeout) ||
                  !Number.isInteger(inactivityTimeout)
                ) {
                  $flags.inactivityTimeout.value = null;
                  return;
                }

                $flags.inactivityTimeout.value = inactivityTimeout;
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
            checked={Boolean($flags.screensaverEnable.value)}
            id="screensaverEnable"
            name="screensaverEnable"
            type="checkbox"
            onChange={useCallback<JSX.GenericEventHandler<HTMLInputElement>>(
              ({ currentTarget: { checked } }) => {
                $flags.screensaverEnable.value = checked;

                if (!checked) {
                  $flags.screensaverRandomizePosition.value = false;
                }
              },
              [],
            )}
          />
        </Entry>
        <ShowHide show={Boolean($flags.screensaverEnable.value)}>
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
              checked={Boolean($flags.screensaverRandomizePosition.value)}
              id="screensaverRandomizePosition"
              name="screensaverRandomizePosition"
              type="checkbox"
              onChange={useCallback<JSX.GenericEventHandler<HTMLInputElement>>(
                ({ currentTarget: { checked } }) => {
                  $flags.screensaverRandomizePosition.value = checked;
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
            checked={Boolean($flags.debug.value)}
            id="debug"
            name="debug"
            type="checkbox"
            onChange={useCallback<JSX.GenericEventHandler<HTMLInputElement>>(
              ({ currentTarget: { checked } }) => {
                $flags.debug.value = checked;
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
            placeholder={$autoLabel}
            type="url"
            value={$flags.apiBaseUrl.value || ''}
            onBlur={useCallback<JSX.GenericEventHandler<HTMLInputElement>>(
              ({
                currentTarget: { value },
              }: JSX.TargetedEvent<HTMLInputElement, Event>) => {
                const apiBaseUrl = value.trim();
                if (apiBaseUrl.length === 0) {
                  $flags.apiBaseUrl.value = null;
                  return;
                }

                try {
                  const url = new URL(apiBaseUrl);
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
            checked={Boolean($flags.updateUnattended.value)}
            id="updateUnattended"
            name="updateUnattended"
            type="checkbox"
            onChange={useCallback<JSX.GenericEventHandler<HTMLInputElement>>(
              ({
                currentTarget: { checked },
              }: JSX.TargetedEvent<HTMLInputElement, Event>) => {
                $flags.updateUnattended.value = checked;
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
            value={$flags.updateCheckInterval.value || ''}
            onBlur={useCallback<JSX.GenericEventHandler<HTMLInputElement>>(
              ({
                currentTarget: { value },
              }: JSX.TargetedEvent<HTMLInputElement, Event>) => {
                const updateCheckInterval = Number.parseInt(value.trim(), 10);
                if (
                  !updateCheckInterval ||
                  Number.isNaN(updateCheckInterval) ||
                  !Number.isInteger(updateCheckInterval)
                ) {
                  $flags.updateCheckInterval.value = null;
                  return;
                }

                $flags.updateCheckInterval.value = updateCheckInterval;
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
        <EntryComponent>
          <Button
            onClick={useCallback(() => {
              swProxy?.showNotification('test', { requireInteraction: true });
            }, [])}
          >
            test notification
          </Button>
          <Button
            onClick={useCallback(() => {
              swProxy?.clearNotifications();
            }, [])}
          >
            remove notifications
          </Button>
        </EntryComponent>
      </List>
    </>
  );
};
