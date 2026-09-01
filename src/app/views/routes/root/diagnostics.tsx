/* eslint-disable @typescript-eslint/ban-ts-comment */
import { computed } from '@preact/signals';
import { FunctionComponent } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';

import { serialized } from '../../../api.js';
import { DiagnosticsContainer } from '../../../components/diagnostics.js';
import {
  arrayRenderer,
  objectRenderer,
  primitiveRenderer,
} from '../../../components/json-viewer/basic-renderers.js';
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
} from '../../../components/json-viewer/hierarchy-renderers.js';
import { JSONViewer } from '../../../components/json-viewer/main.js';
import {
  isLocal,
  isPrerelease,
  isProd,
  pkgName,
  pkgVersion,
  slug,
  webpackServe,
} from '../../../env.js';
import {
  useIsInit,
  useIsWebSocketOnline,
  useWebSocketCount,
} from '../../../hooks/use-api.js';
import { useFetchText } from '../../../hooks/use-fetch.js';
import { useFirstTruthy } from '../../../hooks/use-first-truthy.js';
import { useLocalStorage } from '../../../hooks/use-local-storage.js';
import { api, installationId, instanceId } from '../../../main.js';
import { RECONNECT_NOTIFIER } from '../../../reload.js';
import { isFocused$ } from '../../../state/focus.js';
import { isMenuVisible$ } from '../../../state/menu.js';
import {
  building$,
  buildings$,
  floors$,
  home$,
  homes$,
  room$,
  rooms$,
  staticPage$,
  staticPagesBottom,
  staticPagesTop,
} from '../../../state/navigation.js';
import { isRoot$, path$, previousPath$ } from '../../../state/path.js';
import { isScreensaverActive$ } from '../../../state/screensaver.js';
import { theme$ } from '../../../state/theme.js';
import { title$ } from '../../../state/title.js';
import { i18n$ } from '../../../state/translation.js';
import { isVisible$ } from '../../../state/visibility.js';
import { dimensions } from '../../../style.js';
import { useBreakpoint } from '../../../style/breakpoint.js';
import { getMediaQuery } from '../../../style/main.js';
import { pushSubscribeResult$ } from '../../../sw.js';
import { flags$ } from '../../../util/flags.js';
import { baseUrl } from '../../../util/path.js';
import {
  isiDevice,
  isiPad,
  isiPhone,
  isPWA,
  isSafari,
} from '../../../util/useragent.js';
import { Details, Properties } from '../../controls/diagnostics.js';

const DEFAULT_PATH = ['wurstHome', 'sonninstraße16', 'firstFloor'];

const Fallback: FunctionComponent = () => (
  <tr>
    <td>null</td>
  </tr>
);

const Flags: FunctionComponent = () => (
  <table>
    <tbody>
      {' '}
      {Object.entries(flags$).map(([key, observable]) => (
        <tr key={key}>
          <td>{key}</td>
          <td>{JSON.stringify(observable.value)}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const Navigation: FunctionComponent = () => {
  const homes = homes$.value;
  const home = home$.value;

  const buildings = buildings$.value;
  const building = building$.value;

  const floors = floors$.value;
  // const floor = floor$.value;

  const rooms = rooms$.value;
  const room = room$.value;

  const staticPage = staticPage$.value;

  return (
    <table>
      <tbody>
        {' '}
        <tr>
          <td>home</td>
          <td>
            <table>
              <tbody>
                {' '}
                <tr>
                  <td colSpan={999}>elements</td>
                </tr>
                {homes?.map((element) => (
                  <tr key={serialized(element).$id}>
                    <td>
                      <table>
                        <tbody>
                          {' '}
                          <Properties object={element} />
                        </tbody>
                      </table>{' '}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>{' '}
            <table>
              <tbody>
                {' '}
                <tr>
                  <td colSpan={999}>state</td>
                </tr>
                {home ? <Properties object={home} /> : <Fallback />}
              </tbody>
            </table>{' '}
          </td>
        </tr>
        <tr>
          <td>building</td>
          <td>
            <table>
              <tbody>
                {' '}
                <tr>
                  <td colSpan={999}>elements</td>
                </tr>
                {buildings?.map((element) => (
                  <tr key={serialized(element).$id}>
                    <td>
                      <table>
                        <tbody>
                          {' '}
                          <Properties object={element} />
                        </tbody>
                      </table>{' '}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>{' '}
            <table>
              <tbody>
                {' '}
                <tr>
                  <td colSpan={999}>state</td>
                </tr>
                {building ? <Properties object={building} /> : <Fallback />}
              </tbody>
            </table>{' '}
          </td>
        </tr>
        <tr>
          <td>floor</td>
          <td>
            <table>
              <tbody>
                {' '}
                <tr>
                  <td colSpan={999}>elements</td>
                </tr>
                {floors?.map((element) => (
                  <tr key={serialized(element).$id}>
                    <td>
                      <table>
                        <tbody>
                          {' '}
                          <Properties object={element} />
                        </tbody>
                      </table>{' '}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>{' '}
          </td>
        </tr>
        <tr>
          <td>room</td>
          <td>
            <table>
              <tbody>
                {' '}
                <tr>
                  <td colSpan={999}>elements</td>
                </tr>
                {rooms?.map((element) => (
                  <tr key={serialized(element).$id}>
                    <td>
                      <table>
                        <tbody>
                          {' '}
                          <Properties object={element} />
                        </tbody>
                      </table>{' '}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>{' '}
            <table>
              <tbody>
                {' '}
                <tr>
                  <td colSpan={999}>state</td>
                </tr>
                {room ? <Properties object={room} /> : <Fallback />}
              </tbody>
            </table>{' '}
          </td>
        </tr>
        <tr>
          <td>staticPage</td>
          <td>
            <table>
              <tbody>
                {' '}
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
              </tbody>
            </table>{' '}
            <table>
              <tbody>
                {' '}
                <tr>
                  <td>state</td>
                </tr>
                <tr>
                  <td>
                    {useMemo(() => JSON.stringify(staticPage), [staticPage])}
                  </td>
                </tr>
              </tbody>
            </table>{' '}
          </td>
        </tr>
      </tbody>
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
  } = i18n$;

  return (
    <>
      <table>
        <tbody>
          {' '}
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
        </tbody>
      </table>
      <table>
        <tbody>
          {' '}
          {Object.entries(translation).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{JSON.stringify(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>{' '}
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
        new URL('/api/version', flags$.apiBaseUrl.value ?? baseUrl.href).href,
    ).value,
  );

  const apiUpstream = useFetchText(
    computed(
      () =>
        new URL(
          '/__proxy-api-hostname',
          flags$.apiBaseUrl.value ?? baseUrl.href,
        ).href,
    ).value,
  );

  return (
    <DiagnosticsContainer>
      <table>
        <tbody>
          <tr>
            <td>
              <b>Instance ID</b>
            </td>
            <td>{computed(() => JSON.stringify(instanceId))}</td>
          </tr>

          <tr>
            <td>
              <b>Installation ID</b>
            </td>
            <td>{computed(() => JSON.stringify(installationId))}</td>
          </tr>

          <tr>
            <td>
              <b>Base-URL</b>
            </td>
            <td>{computed(() => JSON.stringify(baseUrl.href))}</td>
          </tr>

          <tr>
            <td colSpan={999}>
              <b>package</b>
              <table>
                <tbody>
                  {' '}
                  <tr>
                    <td>
                      <b>name</b>
                    </td>
                    <td>{computed(() => JSON.stringify(`@${pkgName}`))}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>version</b>
                    </td>
                    <td>{computed(() => JSON.stringify(pkgVersion))}</td>
                  </tr>
                </tbody>
              </table>{' '}
            </td>
          </tr>

          <tr>
            <td colSpan={999}>
              <b>API</b>
              <table>
                <tbody>
                  {' '}
                  <tr>
                    <td>
                      <b>version</b>
                    </td>
                    <td>
                      {useMemo(() => JSON.stringify(apiVersion), [apiVersion])}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>upstream</b>
                    </td>
                    <td>
                      {useMemo(
                        () => JSON.stringify(apiUpstream),
                        [apiUpstream],
                      )}
                    </td>
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
                    <td>
                      {useMemo(
                        () => JSON.stringify(streamCount),
                        [streamCount],
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>{' '}
            </td>
          </tr>

          <tr>
            <td colSpan={999}>
              <b>WebPush</b>
              <table>
                <tbody>
                  {' '}
                  <tr>
                    <td>
                      <b>ntfy applicationServerKey</b>
                    </td>
                    <td>
                      {computed(() =>
                        JSON.stringify(
                          pushSubscribeResult$.value?.applicationServerKey,
                        ),
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>pushSubscription</b>
                    </td>
                    <td>
                      <table>
                        <tbody>
                          <tr>
                            <td>
                              <b>endpoint</b>
                            </td>
                            <td>
                              {computed(() =>
                                JSON.stringify(
                                  pushSubscribeResult$.value?.pushSubscription
                                    .endpoint,
                                ),
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <b>expirationTime</b>
                            </td>
                            <td>
                              {computed(() => {
                                const { expirationTime } =
                                  pushSubscribeResult$.value
                                    ?.pushSubscription ?? {};
                                if (!expirationTime) return 'none';

                                const date = new Date(expirationTime);
                                return date.toLocaleTimeString();
                              })}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <b>keys</b>
                            </td>
                            <td>
                              {computed(() =>
                                JSON.stringify(
                                  pushSubscribeResult$.value?.pushSubscription
                                    ?.keys,
                                  undefined,
                                  2,
                                ),
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>ntfy subscribe successful</b>
                    </td>
                    <td>
                      {computed(() =>
                        JSON.stringify(pushSubscribeResult$.value?.success),
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>topics</b>
                    </td>
                    <td>
                      <ul>
                        {computed(() =>
                          pushSubscribeResult$.value?.topics.map((topic) => (
                            <li key={topic}>{JSON.stringify(topic)}</li>
                          )),
                        )}
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>{' '}
            </td>
          </tr>

          <tr>
            <td colSpan={999}>
              <b>build environment</b>
              <table>
                <tbody>
                  {' '}
                  <tr>
                    <td>
                      <b>slug</b>
                    </td>
                    <td>{computed(() => JSON.stringify(slug))}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>isLocal</b>
                    </td>
                    <td>{useMemo(() => JSON.stringify(isLocal), [])}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>isPrerelease</b>
                    </td>
                    <td>{useMemo(() => JSON.stringify(isPrerelease), [])}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>isProd</b>
                    </td>
                    <td>{useMemo(() => JSON.stringify(isProd), [])}</td>
                  </tr>
                </tbody>
              </table>{' '}
            </td>
          </tr>

          <tr>
            <td colSpan={999}>
              <b>Webpack devServer</b>
              <table>
                <tbody>
                  {' '}
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
                        () =>
                          JSON.stringify(
                            sessionStorage.getItem(RECONNECT_NOTIFIER),
                          ),
                        [],
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>{' '}
            </td>
          </tr>

          <tr>
            <td colSpan={999}>
              <b>browser environment</b>
              <table>
                <tbody>
                  {' '}
                  <tr>
                    <td>
                      <b>User Agent</b>
                    </td>
                    <td>
                      {computed(() => JSON.stringify(navigator.userAgent))}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>isSafari</b>
                    </td>
                    <td>{computed(() => JSON.stringify(isSafari))}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>isiDevice</b>
                    </td>
                    <td>{computed(() => JSON.stringify(isiDevice))}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>isiPhone</b>
                    </td>
                    <td>{computed(() => JSON.stringify(isiPhone))}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>isiPad</b>
                    </td>
                    <td>{computed(() => JSON.stringify(isiPad))}</td>
                  </tr>
                </tbody>
              </table>{' '}
            </td>
          </tr>

          <tr>
            <td colSpan={999}>
              <b>display environment</b>
              <table>
                <tbody>
                  {' '}
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
                    <td>{computed(() => JSON.stringify(isVisible$.value))}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>isFocused</b>
                    </td>
                    <td>{computed(() => JSON.stringify(isFocused$.value))}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>isScreensaverActive</b>
                    </td>
                    <td>
                      {computed(() =>
                        JSON.stringify(isScreensaverActive$.value),
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>isDesktop</b>
                    </td>
                    <td>
                      {useMemo(() => JSON.stringify(isDesktop), [isDesktop])}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>theme</b>
                    </td>
                    <td>{computed(() => JSON.stringify(theme$.value))}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>hairline</b>
                    </td>
                    <td>
                      {useMemo(() => JSON.stringify(hairline), [hairline])}
                    </td>
                  </tr>
                </tbody>
              </table>{' '}
            </td>
          </tr>

          <tr>
            <td colSpan={999}>
              <Details summary={<b>flags</b>}>
                <Flags />
              </Details>
            </td>
          </tr>

          <tr>
            <td colSpan={999}>
              <b>path</b>
              <table>
                <tbody>
                  {' '}
                  <tr>
                    <td>isRoot</td>
                    <td>{computed(() => JSON.stringify(isRoot$.value))}</td>
                  </tr>
                  <tr>
                    <td>path</td>
                    <td>{computed(() => JSON.stringify(path$.value))}</td>
                  </tr>
                  <tr>
                    <td>previousPath</td>
                    <td>
                      {computed(() => JSON.stringify(previousPath$.value))}
                    </td>
                  </tr>
                </tbody>
              </table>{' '}
            </td>
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
            <td>{computed(() => JSON.stringify(isMenuVisible$.value))}</td>
          </tr>

          <tr>
            <td>
              <b>title</b>
            </td>
            <td>{computed(() => JSON.stringify(title$.value))}</td>
          </tr>
        </tbody>
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
