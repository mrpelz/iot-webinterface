/* eslint-disable @typescript-eslint/ban-ts-comment */
import { computed } from '@preact/signals';
import { FunctionComponent } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';

import { serialized } from '../../api.js';
import { DiagnosticsContainer } from '../../components/diagnostics.js';
import {
  arrayRenderer,
  objectRenderer,
  primitiveRenderer,
} from '../../components/json-viewer/basic-renderers.js';
import {
  collectInteractionReferenceRenderer,
  emitInteractionReferenceRenderer,
  getterRenderer,
  idRenderer,
  interactionTypeRenderer,
  levelRenderer,
  setterRenderer,
  speciesRenderer,
  triggerRenderer,
  valueTypeRenderer,
} from '../../components/json-viewer/hierarchy-renderers.js';
import { JSONViewer } from '../../components/json-viewer/main.js';
import { Details, Properties } from '../../controls/diagnostics.js';
import {
  useIsInit,
  useIsWebSocketOnline,
  useWebSocketCount,
} from '../../hooks/use-api.js';
import { useFetchText } from '../../hooks/use-fetch.js';
import { useFirstTruthy } from '../../hooks/use-first-truthy.js';
import { useLocalStorage } from '../../hooks/use-local-storage.js';
import { api, id } from '../../main.js';
import { RECONNECT_NOTIFIER, webpackServe } from '../../reload.js';
import { $isFocused } from '../../state/focus.js';
import { $isMenuVisible } from '../../state/menu.js';
import {
  $building,
  $buildings,
  $floors,
  $home,
  $homes,
  $room,
  $rooms,
  $staticPage,
  staticPagesBottom,
  staticPagesTop,
} from '../../state/navigation.js';
import { $isRoot, $path, $previousPath } from '../../state/path.js';
import { $isScreensaverActive } from '../../state/screensaver.js';
import { $theme } from '../../state/theme.js';
import { $title } from '../../state/title.js';
import { $i18n } from '../../state/translation.js';
import { $isVisible } from '../../state/visibility.js';
import { dimensions } from '../../style.js';
import { useBreakpoint } from '../../style/breakpoint.js';
import { getMediaQuery } from '../../style/main.js';
import { isPrerelease, isProd } from '../../sw.js';
import { $flags } from '../../util/flags.js';
import { isPWA } from '../../util/useragent.js';

const DEFAULT_PATH = ['wurstHome', 'sonninstraße16', 'firstFloor'];

const Fallback: FunctionComponent = () => (
  <tr>
    <td>null</td>
  </tr>
);

const Flags: FunctionComponent = () => (
  <table>
    {Object.entries($flags).map(([key, observable]) => (
      <tr key={key}>
        <td>{key}</td>
        <td>{JSON.stringify(observable.value)}</td>
      </tr>
    ))}
  </table>
);

const Navigation: FunctionComponent = () => {
  const homes = $homes.value;
  const home = $home.value;

  const buildings = $buildings.value;
  const building = $building.value;

  const floors = $floors.value;
  // const floor = $floor.value;

  const rooms = $rooms.value;
  const room = $room.value;

  const staticPage = $staticPage.value;

  return (
    <table>
      <tr>
        <td>home</td>
        <td>
          <table>
            <tr>
              <td colSpan={999}>elements</td>
            </tr>
            {homes?.map((element) => (
              <tr key={serialized(element).$id}>
                <td>
                  <table>
                    <Properties object={element} />
                  </table>
                </td>
              </tr>
            ))}
          </table>
          <table>
            <tr>
              <td colSpan={999}>state</td>
            </tr>
            {home ? <Properties object={home} /> : <Fallback />}
          </table>
        </td>
      </tr>
      <tr>
        <td>building</td>
        <td>
          <table>
            <tr>
              <td colSpan={999}>elements</td>
            </tr>
            {buildings?.map((element) => (
              <tr key={serialized(element).$id}>
                <td>
                  <table>
                    <Properties object={element} />
                  </table>
                </td>
              </tr>
            ))}
          </table>
          <table>
            <tr>
              <td colSpan={999}>state</td>
            </tr>
            {building ? <Properties object={building} /> : <Fallback />}
          </table>
        </td>
      </tr>
      <tr>
        <td>floor</td>
        <td>
          <table>
            <tr>
              <td colSpan={999}>elements</td>
            </tr>
            {floors?.map((element) => (
              <tr key={serialized(element).$id}>
                <td>
                  <table>
                    <Properties object={element} />
                  </table>
                </td>
              </tr>
            ))}
          </table>
        </td>
      </tr>
      <tr>
        <td>room</td>
        <td>
          <table>
            <tr>
              <td colSpan={999}>elements</td>
            </tr>
            {rooms?.map((element) => (
              <tr key={serialized(element).$id}>
                <td>
                  <table>
                    <Properties object={element} />
                  </table>
                </td>
              </tr>
            ))}
          </table>
          <table>
            <tr>
              <td colSpan={999}>state</td>
            </tr>
            {room ? <Properties object={room} /> : <Fallback />}
          </table>
        </td>
      </tr>
      <tr>
        <td>staticPage</td>
        <td>
          <table>
            <tr>
              <td colSpan={999}>elements</td>
            </tr>
            <tr>
              <td>top</td>
              <td>
                {staticPagesTop.map((page) => (
                  <tr key={page}>
                    <td>{JSON.stringify(page)}</td>
                  </tr>
                ))}
              </td>
            </tr>
            <tr>
              <td>bottom</td>
              <td>
                {staticPagesBottom.map((page) => (
                  <tr key={page}>
                    <td>{JSON.stringify(page)}</td>
                  </tr>
                ))}
              </td>
            </tr>
          </table>
          <table>
            <tr>
              <td>state</td>
            </tr>
            <tr>
              <td>{useMemo(() => JSON.stringify(staticPage), [staticPage])}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  );
};

const I18n: FunctionComponent = () => {
  // prettier-ignore
  const {
    value: {
      country,
      language,
      locale,
      translation,
      translationLanguage,
      translationLocale
    }
  } = $i18n;

  return (
    <>
      <table>
        <tr>
          <td>country</td>
          <td>{useMemo(() => JSON.stringify(country), [country])}</td>
        </tr>
        <tr>
          <td>language</td>
          <td>{useMemo(() => JSON.stringify(language), [language])}</td>
        </tr>
        <tr>
          <td>locale</td>
          <td>{useMemo(() => JSON.stringify(locale), [locale])}</td>
        </tr>
        <tr>
          <td>translationLanguage</td>
          <td>
            {useMemo(
              () => JSON.stringify(translationLanguage),
              [translationLanguage],
            )}
          </td>
        </tr>
        <tr>
          <td>translationLocale</td>
          <td>
            {useMemo(
              () => JSON.stringify(translationLocale),
              [translationLocale],
            )}
          </td>
        </tr>
      </table>

      <table>
        {Object.entries(translation).map(([key, value]) => (
          <tr key={key}>
            <td>{key}</td>
            <td>{JSON.stringify(value)}</td>
          </tr>
        ))}
      </table>
    </>
  );
};

export const Diagnostics: FunctionComponent = () => {
  const { value: isWebSocketOnline } = useIsWebSocketOnline();
  const { value: webSocketCount } = useWebSocketCount();

  const isDesktop = useBreakpoint(getMediaQuery(dimensions.breakpointDesktop));
  const hairline = dimensions.hairline();

  const streamCount = isWebSocketOnline ? webSocketCount : 0;

  // @ts-ignore
  const hierarchy = useIsInit() ? api.hierarchy : undefined;

  const jsonViewerRenderers = useMemo(
    () =>
      new Set([
        collectInteractionReferenceRenderer,
        emitInteractionReferenceRenderer,
        // @ts-ignore
        getterRenderer,
        idRenderer,
        interactionTypeRenderer,
        levelRenderer,
        // @ts-ignore
        setterRenderer,
        speciesRenderer,
        // @ts-ignore
        triggerRenderer,
        valueTypeRenderer,
        arrayRenderer,
        objectRenderer,
        primitiveRenderer,
      ]),
    [],
  );

  const [persistedPath_, setPersistedPath] = useLocalStorage<PropertyKey[]>(
    'diagnostics-hierarchy-path',
  );
  const persistedPath = useFirstTruthy(persistedPath_);

  const handlePathChange = useCallback(
    (paths: PropertyKey[][]) => {
      const last = paths.at(-1);
      if (!last) return;

      setPersistedPath(last.length > DEFAULT_PATH.length ? last : undefined);
    },
    [setPersistedPath],
  );

  const apiVersion = useFetchText(
    computed(
      () =>
        new URL('/api/version', $flags.apiBaseUrl.value ?? self.location.href)
          .href,
    ).value,
  );

  const apiUpstream = useFetchText(
    computed(
      () =>
        new URL(
          '/__proxy-api-hostname',
          $flags.apiBaseUrl.value ?? self.location.href,
        ).href,
    ).value,
  );

  return (
    <DiagnosticsContainer>
      <table>
        <tr>
          <td>
            <b>version</b>
          </td>
          <td>{computed(() => JSON.stringify(window.__version__))}</td>
        </tr>

        <tr>
          <td>
            <b>API-version</b>
          </td>
          <td>{useMemo(() => JSON.stringify(apiVersion), [apiVersion])}</td>
        </tr>

        <tr>
          <td>
            <b>API-upstream</b>
          </td>
          <td>{useMemo(() => JSON.stringify(apiUpstream), [apiUpstream])}</td>
        </tr>

        <tr>
          <td>
            <b>Instance ID</b>
          </td>
          <td>{computed(() => JSON.stringify(id))}</td>
        </tr>

        <tr>
          <td colSpan={999}>
            <Details summary={<b>flags</b>}>
              <Flags />
            </Details>
          </td>
        </tr>

        <tr>
          <td>
            <b>isPWA</b>
          </td>
          <td>{computed(() => JSON.stringify(isPWA))}</td>
        </tr>

        <tr>
          <td>
            <b>isVisible</b>
          </td>
          <td>{computed(() => JSON.stringify($isVisible.value))}</td>
        </tr>

        <tr>
          <td>
            <b>isFocused</b>
          </td>
          <td>{computed(() => JSON.stringify($isFocused.value))}</td>
        </tr>

        <tr>
          <td>
            <b>isScreensaverActive</b>
          </td>
          <td>{computed(() => JSON.stringify($isScreensaverActive.value))}</td>
        </tr>

        <tr>
          <td>
            <b>isProd</b>
          </td>
          <td>{useMemo(() => JSON.stringify(isProd), [])}</td>
        </tr>

        <tr>
          <td>
            <b>isPrerelease</b>
          </td>
          <td>{useMemo(() => JSON.stringify(isPrerelease), [])}</td>
        </tr>

        <tr>
          <td>
            <b>webpackServe</b>
          </td>
          <td>{useMemo(() => JSON.stringify(webpackServe), [])}</td>
        </tr>

        <tr>
          <td>
            <b>webpackHash</b>
          </td>
          <td>
            {useMemo(
              () => JSON.stringify(sessionStorage.getItem(RECONNECT_NOTIFIER)),
              [],
            )}
          </td>
        </tr>

        <tr>
          <td colSpan={999}>
            <b>path</b>

            <table>
              <tr>
                <td>isRoot</td>
                <td>{computed(() => JSON.stringify($isRoot.value))}</td>
              </tr>
              <tr>
                <td>path</td>
                <td>{computed(() => JSON.stringify($path.value))}</td>
              </tr>
              <tr>
                <td>previousPath</td>
                <td>{computed(() => JSON.stringify($previousPath.value))}</td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td>
            <b>theme</b>
          </td>
          <td>{computed(() => JSON.stringify($theme.value))}</td>
        </tr>

        <tr>
          <td>
            <b>isDesktop</b>
          </td>
          <td>{useMemo(() => JSON.stringify(isDesktop), [isDesktop])}</td>
        </tr>

        <tr>
          <td>
            <b>hairline</b>
          </td>
          <td>{useMemo(() => JSON.stringify(hairline), [hairline])}</td>
        </tr>

        <tr>
          <td>
            <b>stream connected</b>
          </td>
          <td>
            {useMemo(
              () => JSON.stringify(isWebSocketOnline),
              [isWebSocketOnline],
            )}
          </td>
        </tr>

        <tr>
          <td>
            <b>stream client count</b>
          </td>
          <td>{useMemo(() => JSON.stringify(streamCount), [streamCount])}</td>
        </tr>

        <tr>
          <td colSpan={999}>
            <Details summary={<b>navigation</b>}>
              <Navigation />
            </Details>
          </td>
        </tr>

        <tr>
          <td colSpan={999}>
            <Details summary={<b>i18n</b>}>
              <I18n />
            </Details>
          </td>
        </tr>

        <tr>
          <td>
            <b>menu visible</b>
          </td>
          <td>{computed(() => JSON.stringify($isMenuVisible.value))}</td>
        </tr>

        <tr>
          <td>
            <b>title</b>
          </td>
          <td>{computed(() => JSON.stringify($title.value))}</td>
        </tr>
      </table>

      {hierarchy ? (
        <JSONViewer
          autoExpandPath={persistedPath ?? DEFAULT_PATH}
          handlePathChange={handlePathChange}
          renderers={jsonViewerRenderers}
          rootLabel="Hierarchy"
          value={hierarchy}
        />
      ) : null}
    </DiagnosticsContainer>
  );
};
