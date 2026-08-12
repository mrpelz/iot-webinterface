import { List, ListButton, ListInput, ListItem, Toggle } from 'konsta/react';
import { FunctionComponent, GenericEventHandler, TargetedEvent } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';

<<<<<<< HEAD:src/app/views/routes/root/settings.tsx
import { serialized } from '../../../api.js';
import { Button, Entry as EntryComponent } from '../../../components/list.js';
import { ShowHide } from '../../../components/show-hide.js';
import { useArray } from '../../../hooks/use-array-compare.js';
import { I18nLanguage, i18nLanguages } from '../../../i18n/main.js';
import { api } from '../../../main.js';
=======
import { serialized } from '../../api.js';
import {
  listButtonDefaults,
  toggleDefaults,
} from '../../components/konsta-ui-overrides.js';
import { ShowHide } from '../../components/show-hide.js';
import { useArray } from '../../hooks/use-array-compare.js';
import { I18nLanguage, i18nLanguages } from '../../i18n/main.js';
import { api } from '../../main.js';
>>>>>>> b954e8b (chore: [WIP]):src/app/routes/root/settings.tsx
import {
  building$,
  buildings$,
  home$,
  homes$,
  rooms$,
  setBuildingName,
  setHomeName,
  staticPages,
<<<<<<< HEAD:src/app/views/routes/root/settings.tsx
} from '../../../state/navigation.js';
import { Theme, theme$, themes } from '../../../state/theme.js';
import { getTranslationFallback } from '../../../state/translation.js';
import { swProxy } from '../../../sw.js';
import { clear, flags$ } from '../../../util/flags.js';
import { baseUrl } from '../../../util/path.js';
import { Entry, List } from '../../../views/list.js';
import { Translation } from '../../../views/translation.js';
=======
} from '../../state/navigation.js';
import { $theme, Theme, themes } from '../../state/theme.js';
import { getTranslationFallback } from '../../state/translation.js';
import { swProxy } from '../../sw.js';
import { $flags, clear } from '../../util/flags.js';
import { baseUrl } from '../../util/path.js';
import { Translation } from '../../views/translation.js';
>>>>>>> b954e8b (chore: [WIP]):src/app/routes/root/settings.tsx

const staticPageLabel$ = getTranslationFallback('staticPage');
const roomLabel$ = getTranslationFallback('room');

export const Settings: FunctionComponent = () => {
  const rooms = rooms$.value;
  const roomNames = useArray(
    useMemo(() => (rooms ? rooms.map((room) => room.$) : []), [rooms]),
  );

  const startPages = useMemo(() => [...staticPages, ...roomNames], [roomNames]);

  return (
    <>
      <List
        inset
        strong
      >
        <ListInput
          dropdown
          disabled={!$homes.value || $homes.value.length <= 1}
          id="home"
          name="home"
          type="select"
          label={
            <Translation
              capitalize={true}
              i18nKey="home"
            />
          }
          onChange={useCallback<GenericEventHandler<HTMLSelectElement>>(
            ({
              currentTarget: { value },
            }: TargetedEvent<HTMLSelectElement, Event>) => {
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
<<<<<<< HEAD:src/app/views/routes/root/settings.tsx
          <select
            disabled={!homes$.value || homes$.value.length <= 1}
            id="home"
            name="home"
            onChange={useCallback<GenericEventHandler<HTMLSelectElement>>(
              ({
                currentTarget: { value },
              }: TargetedEvent<HTMLSelectElement, Event>) => {
                const matchingHome = homes$.value?.find(
                  (home) => home.$ === value,
                );

                if (!matchingHome || matchingHome === home$.value) {
                  return;
                }

                setHomeName?.(matchingHome.$);
              },
              [],
            )}
          >
            {homes$.value?.map((home) => (
              <option
                key={serialized(home).$id}
                selected={home === home$.value}
                value={home.$}
              >
                <Translation i18nKey={home.$} />
              </option>
            )) ?? null}
          </select>
        </Entry>
        <Entry
=======
          {$homes.value?.map((home) => (
            <option
              key={serialized(home).$id}
              selected={home === $home.value}
              value={home.$}
            >
              <Translation i18nKey={home.$} />
            </option>
          )) ?? null}
        </ListInput>
        <ListInput
          dropdown
          disabled={!$buildings.value || $buildings.value.length <= 1}
>>>>>>> b954e8b (chore: [WIP]):src/app/routes/root/settings.tsx
          id="building"
          name="building"
          type="select"
          label={
            <Translation
              capitalize={true}
              i18nKey="building"
            />
          }
<<<<<<< HEAD:src/app/views/routes/root/settings.tsx
        >
          <select
            disabled={!buildings$.value || buildings$.value.length <= 1}
            id="building"
            name="building"
            onChange={useCallback<GenericEventHandler<HTMLSelectElement>>(
              ({
                currentTarget: { value },
              }: TargetedEvent<HTMLSelectElement, Event>) => {
                const matchingBuilding = buildings$.value?.find(
                  (building) => building.$ === value,
                );
                if (!matchingBuilding || matchingBuilding === building$.value) {
                  return;
                }

                setBuildingName?.(matchingBuilding.$);
              },
              [],
            )}
          >
            {buildings$.value?.map((building) => (
              <option
                key={serialized(building).$id}
                selected={building === building$.value}
                value={building.$}
              >
                <Translation i18nKey={building.$} />
              </option>
            )) ?? null}
          </select>
        </Entry>
        <Entry
=======
          onChange={useCallback<GenericEventHandler<HTMLSelectElement>>(
            ({
              currentTarget: { value },
            }: TargetedEvent<HTMLSelectElement, Event>) => {
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
              key={serialized(building).$id}
              selected={building === $building.value}
              value={building.$}
            >
              <Translation i18nKey={building.$} />
            </option>
          )) ?? null}
        </ListInput>
        <ListInput
          dropdown
>>>>>>> b954e8b (chore: [WIP]):src/app/routes/root/settings.tsx
          id="startPage"
          name="startPage"
          type="select"
          label={
            <Translation
              capitalize={true}
              i18nKey="startPage"
            />
          }
          onChange={useCallback<GenericEventHandler<HTMLSelectElement>>(
            ({
              currentTarget: { value },
            }: TargetedEvent<HTMLSelectElement, Event>) => {
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
<<<<<<< HEAD:src/app/views/routes/root/settings.tsx
          <select
            id="startPage"
            name="startPage"
            onChange={useCallback<GenericEventHandler<HTMLSelectElement>>(
              ({
                currentTarget: { value },
              }: TargetedEvent<HTMLSelectElement, Event>) => {
                const selectedOverride = value;
                if (selectedOverride === 'auto') {
                  flags$.startPage.value = null;
                }

                if (
                  !startPages.includes(
                    selectedOverride as (typeof startPages)[number],
                  )
                ) {
                  return;
                }

                flags$.startPage.value = selectedOverride;
              },
              [startPages],
            )}
          >
            <option
              selected={flags$.startPage.value === null}
              value="auto"
            >
              <Translation i18nKey="auto" />
            </option>
            <optgroup label={staticPageLabel$}>
              {staticPages.map((staticPage) => (
                <option
                  key={staticPage}
                  selected={staticPage === flags$.startPage.value}
                  value={staticPage}
                >
                  <Translation i18nKey={staticPage} />
                </option>
              ))}
            </optgroup>
            <optgroup label={roomLabel$}>
              {roomNames.map((room) => (
                <option
                  key={room}
                  selected={room === flags$.startPage.value}
                  value={room}
                >
                  <Translation i18nKey={room} />
                </option>
              ))}
            </optgroup>
          </select>
        </Entry>
        <Entry
=======
          <option
            selected={$flags.startPage.value === null}
            value="auto"
          >
            <Translation i18nKey="auto" />
          </option>
          <optgroup label={$staticPageLabel}>
            {staticPages.map((staticPage) => (
              <option
                key={staticPage}
                selected={staticPage === $flags.startPage.value}
                value={staticPage}
              >
                <Translation i18nKey={staticPage} />
              </option>
            ))}
          </optgroup>
          <optgroup label={$roomLabel}>
            {roomNames.map((room) => (
              <option
                key={room}
                selected={room === $flags.startPage.value}
                value={room}
              >
                <Translation i18nKey={room} />
              </option>
            ))}
          </optgroup>
        </ListInput>
        <ListItem
          label
          id="pagePersistence"
          after={
            <Toggle
              checked={$flags.pagePersistence.value}
              className={toggleDefaults}
              id="pagePersistence"
              name="pagePersistence"
              onChange={useCallback<GenericEventHandler<HTMLInputElement>>(
                ({ currentTarget: { checked } }) => {
                  $flags.pagePersistence.value = checked;
                },
                [],
              )}
            />
          }
          title={
            <Translation
              capitalize={true}
              i18nKey="persistPage"
            />
          }
        />
        <ListItem
          label
>>>>>>> b954e8b (chore: [WIP]):src/app/routes/root/settings.tsx
          id="hallwayStreamEnable"
          after={
            <Toggle
              checked={$flags.hallwayStreamEnable.value}
              className={toggleDefaults}
              id="hallwayStreamEnable"
              name="hallwayStreamEnable"
              onChange={useCallback<GenericEventHandler<HTMLInputElement>>(
                ({ currentTarget: { checked } }) => {
                  $flags.hallwayStreamEnable.value = checked;
                },
                [],
              )}
            />
          }
          title={
            <Translation
              capitalize={true}
              i18nKey="enableHallwayStream"
            />
          }
<<<<<<< HEAD:src/app/views/routes/root/settings.tsx
        >
          <Toggle
            checked={flags$.hallwayStreamEnable.value}
            id="hallwayStreamEnable"
            name="hallwayStreamEnable"
            onChange={useCallback<GenericEventHandler<HTMLInputElement>>(
              ({ currentTarget: { checked } }) => {
                flags$.hallwayStreamEnable.value = checked;
              },
              [],
            )}
          />
        </Entry>
=======
        />
>>>>>>> b954e8b (chore: [WIP]):src/app/routes/root/settings.tsx
      </List>
      <List
        inset
        strong
      >
        <ListInput
          dropdown
          id="theme"
          name="theme"
          type="select"
          label={
            <Translation
              capitalize={true}
              i18nKey="theme"
            />
          }
          onChange={useCallback<GenericEventHandler<HTMLSelectElement>>(
            ({
              currentTarget: { value },
            }: TargetedEvent<HTMLSelectElement, Event>) => {
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
<<<<<<< HEAD:src/app/views/routes/root/settings.tsx
          <select
            id="theme"
            name="theme"
            onChange={useCallback<GenericEventHandler<HTMLSelectElement>>(
              ({
                currentTarget: { value },
              }: TargetedEvent<HTMLSelectElement, Event>) => {
                const theme = value as Theme | 'auto';
                if (theme === 'auto') {
                  flags$.theme.value = null;
                  return;
                }

                if (!themes.includes(theme) || theme === theme$.value) {
                  return;
                }

                flags$.theme.value = theme;
              },
              [],
            )}
=======
          <option
            selected={$flags.theme.value === null}
            value="auto"
>>>>>>> b954e8b (chore: [WIP]):src/app/routes/root/settings.tsx
          >
            <Translation i18nKey="auto" />
          </option>
          {themes.map((theme) => (
            <option
<<<<<<< HEAD:src/app/views/routes/root/settings.tsx
              selected={flags$.theme.value === null}
              value="auto"
=======
              key={theme}
              selected={theme === $flags.theme.value}
              value={theme}
>>>>>>> b954e8b (chore: [WIP]):src/app/routes/root/settings.tsx
            >
              <Translation i18nKey={theme} />
            </option>
<<<<<<< HEAD:src/app/views/routes/root/settings.tsx
            {themes.map((theme) => (
              <option
                key={theme}
                selected={theme === flags$.theme.value}
                value={theme}
              >
                <Translation i18nKey={theme} />
              </option>
            ))}
          </select>
        </Entry>
        <Entry
=======
          ))}
        </ListInput>
        <ListInput
          dropdown
>>>>>>> b954e8b (chore: [WIP]):src/app/routes/root/settings.tsx
          id="language"
          name="language"
          type="select"
          label={
            <Translation
              capitalize={true}
              i18nKey="language"
            />
          }
          onChange={useCallback<GenericEventHandler<HTMLSelectElement>>(
            ({
              currentTarget: { value },
            }: TargetedEvent<HTMLSelectElement, Event>) => {
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
<<<<<<< HEAD:src/app/views/routes/root/settings.tsx
          <select
            id="language"
            name="language"
            onChange={useCallback<GenericEventHandler<HTMLSelectElement>>(
              ({
                currentTarget: { value },
              }: TargetedEvent<HTMLSelectElement, Event>) => {
                const language = value as I18nLanguage | 'auto';
                if (language === 'auto') {
                  flags$.language.value = null;
                  return;
                }

                if (
                  !i18nLanguages.includes(language) ||
                  language === flags$.language.value
                ) {
                  return;
                }

                flags$.language.value = language;
              },
              [],
            )}
=======
          <option
            selected={$flags.language.value === null}
            value="auto"
>>>>>>> b954e8b (chore: [WIP]):src/app/routes/root/settings.tsx
          >
            <Translation i18nKey="auto" />
          </option>
          {i18nLanguages.map((language) => (
            <option
<<<<<<< HEAD:src/app/views/routes/root/settings.tsx
              selected={flags$.language.value === null}
              value="auto"
=======
              key={language}
              selected={language === $flags.language.value}
              value={language}
>>>>>>> b954e8b (chore: [WIP]):src/app/routes/root/settings.tsx
            >
              <Translation i18nKey={language} />
            </option>
<<<<<<< HEAD:src/app/views/routes/root/settings.tsx
            {i18nLanguages.map((language) => (
              <option
                key={language}
                selected={language === flags$.language.value}
                value={language}
              >
                <Translation i18nKey={language} />
              </option>
            ))}
          </select>
        </Entry>
        <Entry
=======
          ))}
        </ListInput>
        <ListItem
          label
>>>>>>> b954e8b (chore: [WIP]):src/app/routes/root/settings.tsx
          id="absoluteTimes"
          after={
            <Toggle
              checked={$flags.absoluteTimes.value}
              className={toggleDefaults}
              id="absoluteTimes"
              name="absoluteTimes"
              onChange={useCallback<GenericEventHandler<HTMLInputElement>>(
                ({ currentTarget: { checked } }) => {
                  $flags.absoluteTimes.value = checked;
                },
                [],
              )}
            />
          }
          title={
            <Translation
              capitalize={true}
              i18nKey="absoluteTimes"
            />
          }
<<<<<<< HEAD:src/app/views/routes/root/settings.tsx
        >
          <Toggle
            checked={flags$.absoluteTimes.value}
            id="absoluteTimes"
            name="absoluteTimes"
            onChange={useCallback<GenericEventHandler<HTMLInputElement>>(
              ({ currentTarget: { checked } }) => {
                flags$.absoluteTimes.value = checked;
              },
              [],
            )}
          />
        </Entry>
=======
        />
>>>>>>> b954e8b (chore: [WIP]):src/app/routes/root/settings.tsx
      </List>
      <List
        inset
        strong
      >
        <ListItem
          label
          id="inactivityTimeout"
          after={
            <div>
              <input
                id="inactivityTimeout"
                inputMode="numeric"
                min="10"
                name="inactivityTimeout"
                pattern="[0-9]*"
                placeholder="0"
                value={($flags.inactivityTimeout.value ?? 0) / 1000 || ''}
                onBlur={useCallback<GenericEventHandler<HTMLInputElement>>(
                  ({
                    currentTarget: { value },
                  }: TargetedEvent<HTMLInputElement, Event>) => {
                    const inactivityTimeout = Number.parseInt(value.trim(), 10);
                    if (
                      !inactivityTimeout ||
                      inactivityTimeout < 10 ||
                      Number.isNaN(inactivityTimeout) ||
                      !Number.isInteger(inactivityTimeout)
                    ) {
                      $flags.inactivityTimeout.value = null;
                      return;
                    }

                    $flags.inactivityTimeout.value = inactivityTimeout * 1000;
                  },
                  [],
                )}
              />
              <i> s</i>
            </div>
          }
          title={
            <Translation
              capitalize={true}
              i18nKey="inactivityTimeout"
            />
          }
<<<<<<< HEAD:src/app/views/routes/root/settings.tsx
        >
          <div>
            <input
              id="inactivityTimeout"
              inputMode="numeric"
              min="10"
              name="inactivityTimeout"
              pattern="[0-9]*"
              placeholder="0"
              value={(flags$.inactivityTimeout.value ?? 0) / 1000 || ''}
              onBlur={useCallback<GenericEventHandler<HTMLInputElement>>(
                ({
                  currentTarget: { value },
                }: TargetedEvent<HTMLInputElement, Event>) => {
                  const inactivityTimeout = Number.parseInt(value.trim(), 10);
                  if (
                    !inactivityTimeout ||
                    inactivityTimeout < 10 ||
                    Number.isNaN(inactivityTimeout) ||
                    !Number.isInteger(inactivityTimeout)
                  ) {
                    flags$.inactivityTimeout.value = null;
                    return;
                  }

                  flags$.inactivityTimeout.value = inactivityTimeout * 1000;
=======
        />
        <ListItem
          label
          id="screensaverEnable"
          after={
            <Toggle
              checked={$flags.screensaverEnable.value}
              className={toggleDefaults}
              id="screensaverEnable"
              name="screensaverEnable"
              onChange={useCallback<GenericEventHandler<HTMLInputElement>>(
                ({ currentTarget: { checked } }) => {
                  $flags.screensaverEnable.value = checked;

                  if (!checked) {
                    $flags.screensaverRandomizePosition.value = false;
                  }
>>>>>>> b954e8b (chore: [WIP]):src/app/routes/root/settings.tsx
                },
                [],
              )}
            />
          }
          title={
            <Translation
              capitalize={true}
              i18nKey="enableScreensaver"
            />
          }
<<<<<<< HEAD:src/app/views/routes/root/settings.tsx
        >
          <Toggle
            checked={flags$.screensaverEnable.value}
            id="screensaverEnable"
            name="screensaverEnable"
            onChange={useCallback<GenericEventHandler<HTMLInputElement>>(
              ({ currentTarget: { checked } }) => {
                flags$.screensaverEnable.value = checked;

                if (!checked) {
                  flags$.screensaverRandomizePosition.value = false;
                }
              },
              [],
            )}
          />
        </Entry>
        <ShowHide show={flags$.screensaverEnable.value}>
          <Entry
=======
        />
        <ShowHide show={$flags.screensaverEnable.value}>
          <ListItem
            label
>>>>>>> b954e8b (chore: [WIP]):src/app/routes/root/settings.tsx
            id="screensaverRandomizePosition"
            after={
              <Toggle
                checked={$flags.screensaverRandomizePosition.value}
                className={toggleDefaults}
                id="screensaverRandomizePosition"
                name="screensaverRandomizePosition"
                onChange={useCallback<GenericEventHandler<HTMLInputElement>>(
                  ({ currentTarget: { checked } }) => {
                    $flags.screensaverRandomizePosition.value = checked;
                  },
                  [],
                )}
              />
            }
            title={
              <Translation
                capitalize={true}
                i18nKey="randomizeScreensaverPosition"
              />
            }
          />
        </ShowHide>
      </List>
      <List
        inset
        strong
      >
        <ListItem
          label
          id="debug"
          after={
            <Toggle
<<<<<<< HEAD:src/app/views/routes/root/settings.tsx
              checked={flags$.screensaverRandomizePosition.value}
              id="screensaverRandomizePosition"
              name="screensaverRandomizePosition"
              onChange={useCallback<GenericEventHandler<HTMLInputElement>>(
                ({ currentTarget: { checked } }) => {
                  flags$.screensaverRandomizePosition.value = checked;
=======
              checked={$flags.debug.value}
              className={toggleDefaults}
              id="debug"
              name="debug"
              onChange={useCallback<GenericEventHandler<HTMLInputElement>>(
                ({ currentTarget: { checked } }) => {
                  $flags.debug.value = checked;
>>>>>>> b954e8b (chore: [WIP]):src/app/routes/root/settings.tsx
                },
                [],
              )}
            />
          }
          title={
            <Translation
              capitalize={true}
              i18nKey="debug"
            />
          }
<<<<<<< HEAD:src/app/views/routes/root/settings.tsx
        >
          <Toggle
            checked={flags$.debug.value}
            id="debug"
            name="debug"
            onChange={useCallback<GenericEventHandler<HTMLInputElement>>(
              ({ currentTarget: { checked } }) => {
                flags$.debug.value = checked;
              },
              [],
            )}
          />
        </Entry>
        <Entry
=======
        />
        <ListItem
          label
>>>>>>> b954e8b (chore: [WIP]):src/app/routes/root/settings.tsx
          id="apiBaseUrl"
          after={
            <input
              id="apiBaseUrl"
              name="apiBaseUrl"
              placeholder={useMemo(() => baseUrl.href, [])}
              type="url"
              value={$flags.apiBaseUrl.value || ''}
              onBlur={useCallback<GenericEventHandler<HTMLInputElement>>(
                ({
                  currentTarget: { value },
                }: TargetedEvent<HTMLInputElement, Event>) => {
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
          }
          title={
            <Translation
              capitalize={true}
              i18nKey="apiBaseUrl"
            />
          }
<<<<<<< HEAD:src/app/views/routes/root/settings.tsx
        >
          <input
            id="apiBaseUrl"
            name="apiBaseUrl"
            placeholder={useMemo(() => baseUrl.href, [])}
            type="url"
            value={flags$.apiBaseUrl.value || ''}
            onBlur={useCallback<GenericEventHandler<HTMLInputElement>>(
              ({
                currentTarget: { value },
              }: TargetedEvent<HTMLInputElement, Event>) => {
                const apiBaseUrl = value.trim();
                if (apiBaseUrl.length === 0) {
                  flags$.apiBaseUrl.value = null;
                  return;
                }

                try {
                  const url = new URL(apiBaseUrl);
                  flags$.apiBaseUrl.value = url.href;
                } catch {
                  flags$.apiBaseUrl.value = null;
                }
              },
              [],
            )}
          />
        </Entry>
=======
        />
>>>>>>> b954e8b (chore: [WIP]):src/app/routes/root/settings.tsx
      </List>
      <List
        inset
        strong
      >
        <ListItem
          label
          id="updateUnattended"
          after={
            <Toggle
              checked={$flags.updateUnattended.value}
              className={toggleDefaults}
              id="updateUnattended"
              name="updateUnattended"
              onChange={useCallback<GenericEventHandler<HTMLInputElement>>(
                ({
                  currentTarget: { checked },
                }: TargetedEvent<HTMLInputElement, Event>) => {
                  $flags.updateUnattended.value = checked;
                },
                [],
              )}
            />
          }
          title={
            <Translation
              capitalize={true}
              i18nKey="updateUnattended"
            />
          }
<<<<<<< HEAD:src/app/views/routes/root/settings.tsx
        >
          <Toggle
            checked={flags$.updateUnattended.value}
            id="updateUnattended"
            name="updateUnattended"
            onChange={useCallback<GenericEventHandler<HTMLInputElement>>(
              ({
                currentTarget: { checked },
              }: TargetedEvent<HTMLInputElement, Event>) => {
                flags$.updateUnattended.value = checked;
              },
              [],
            )}
          />
        </Entry>
        <Entry
=======
        />
        <ListItem
          label
>>>>>>> b954e8b (chore: [WIP]):src/app/routes/root/settings.tsx
          id="updateCheckInterval"
          after={
            <input
              id="updateCheckInterval"
              inputMode="numeric"
              min="500"
              name="updateCheckInterval"
              pattern="[0-9]*"
              placeholder="0"
              value={$flags.updateCheckInterval.value || ''}
              onBlur={useCallback<GenericEventHandler<HTMLInputElement>>(
                ({
                  currentTarget: { value },
                }: TargetedEvent<HTMLInputElement, Event>) => {
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
          }
          title={
            <Translation
              capitalize={true}
              i18nKey="updateCheckInterval"
            />
          }
        />
      </List>
      <List
        inset
        strong
      >
        <ListButton
          className={listButtonDefaults}
          linkComponent="button"
          onClick={useCallback(() => swProxy?.removeRegistration(), [])}
        >
<<<<<<< HEAD:src/app/views/routes/root/settings.tsx
          <input
            id="updateCheckInterval"
            inputMode="numeric"
            min="500"
            name="updateCheckInterval"
            pattern="[0-9]*"
            placeholder="0"
            value={flags$.updateCheckInterval.value || ''}
            onBlur={useCallback<GenericEventHandler<HTMLInputElement>>(
              ({
                currentTarget: { value },
              }: TargetedEvent<HTMLInputElement, Event>) => {
                const updateCheckInterval = Number.parseInt(value.trim(), 10);
                if (
                  !updateCheckInterval ||
                  Number.isNaN(updateCheckInterval) ||
                  !Number.isInteger(updateCheckInterval)
                ) {
                  flags$.updateCheckInterval.value = null;
                  return;
                }

                flags$.updateCheckInterval.value = updateCheckInterval;
              },
              [],
            )}
          />
        </Entry>
=======
          update
        </ListButton>
        <ListButton
          className={listButtonDefaults}
          linkComponent="button"
          onClick={useCallback(
            () => (swProxy ? swProxy.reload() : location.reload()),
            [],
          )}
        >
          reload
        </ListButton>
        <ListButton
          className={listButtonDefaults}
          linkComponent="button"
          onClick={useCallback(() => {
            localStorage.clear();
            clear();
            api.clearStores();
          }, [])}
        >
          reset local storage
        </ListButton>
>>>>>>> b954e8b (chore: [WIP]):src/app/routes/root/settings.tsx
      </List>
      <List
        inset
        strong
      >
        <ListButton
          className={listButtonDefaults}
          linkComponent="button"
          style={{ cursor: 'pointer' }}
          onClick={useCallback(() => {
            swProxy?.showNotification('test', { requireInteraction: true });
          }, [])}
        >
          test notification
        </ListButton>
        <ListButton
          className={listButtonDefaults}
          linkComponent="button"
          onClick={useCallback(() => {
            swProxy?.clearNotifications();
          }, [])}
        >
          remove notifications
        </ListButton>
      </List>
    </>
  );
};
