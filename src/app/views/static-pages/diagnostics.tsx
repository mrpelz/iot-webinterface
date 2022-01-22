import {
  DiagnosticsContainer,
  RefreshButton,
  Summary,
} from '../../components/diagnostics.js';
import {
  HierarchyElement,
  Levels,
  Meta,
  ParentRelation,
  ValueType,
  isElementWithMeta,
  isMetaPropertyActuator,
  isMetaPropertySensorDate,
  levelToString,
  parentRelationToString,
  typeToValueType,
  valueTypeToType,
} from '../../web-api.js';
import {
  staticPagesBottom,
  staticPagesTop,
  useNavigation,
} from '../../state/navigation.js';
import {
  useGetter,
  useHierarchy,
  useLevel,
  useSetter,
  useStreamOnline,
} from '../../state/web-api.js';
import { useMemo, useState } from 'preact/hooks';
import { FunctionComponent } from 'preact';
import { dimensions } from '../../style.js';
import { triggerUpdate } from '../../util/auto-reload.js';
import { useBreakpoint } from '../../style/breakpoint.js';
import { useFlags } from '../../state/flags.js';
import { useI18n } from '../../state/i18n.js';
import { useIsMenuVisible } from '../../state/menu.js';
import { useMediaQuery } from '../../style/main.js';
import { useNotification } from '../../state/notification.js';
import { useTheme } from '../../state/theme.js';
import { useVisibility } from '../../state/visibility.js';

const Meta: FunctionComponent<{ element: HierarchyElement }> = ({
  element,
}) => {
  if (!isElementWithMeta(element)) return null;

  const { meta } = element;

  if (!Object.keys(meta).length) return null;

  return (
    <tr>
      <td>
        <b>Meta</b>
      </td>
      <td>
        <table>
          {Object.entries(meta).map(([key, value]) => {
            const level =
              key === 'level'
                ? levelToString(value as unknown as Levels)
                : null;

            const parentRelation =
              key === 'parentRelation'
                ? parentRelationToString(value as unknown as ParentRelation)
                : null;

            const valueType =
              key === 'valueType'
                ? valueTypeToType(value as unknown as ValueType)
                : null;

            return (
              <tr>
                <td>{key}</td>
                <td>
                  {level ||
                    parentRelation ||
                    valueType ||
                    JSON.stringify(value)}
                </td>
              </tr>
            );
          })}
        </table>
      </td>
    </tr>
  );
};

const Getter: FunctionComponent<{ element: HierarchyElement }> = ({
  element,
}) => {
  const { get, meta } = element;
  const isDate = isMetaPropertySensorDate(meta);

  const { country } = useI18n();

  const rawState = useGetter<unknown>(element);
  const state = useMemo(() => {
    return isDate && country && rawState
      ? new Date(rawState as number).toLocaleString(country)
      : JSON.stringify(rawState, undefined, 2);
  }, [isDate, country, rawState]);

  if (get === undefined) return null;

  return (
    <tr>
      <td>
        <b>Getter</b> <i>{get}</i>
      </td>
      <td>
        <pre>{state}</pre>
      </td>
    </tr>
  );
};

const Setter: FunctionComponent<{ element: HierarchyElement }> = ({
  element,
}) => {
  const { meta, set } = element;

  const setter = useSetter<unknown>(element);
  const [input, setInput] = useState<unknown>(undefined);

  if (set === undefined || !isMetaPropertyActuator(meta)) return null;

  const { valueType } = meta;
  const isNull = valueType === ValueType.NULL;
  const namedValueType = valueTypeToType(valueType);

  const onChange: JSX.EventHandler<JSX.TargetedEvent<HTMLInputElement, Event>> =
    ({ currentTarget }) => {
      const { value } = currentTarget;

      if (!value.length) {
        currentTarget.setCustomValidity('');
        setInput(undefined);

        return;
      }

      try {
        const parsedValue = JSON.parse(value);
        const inputType = typeToValueType(parsedValue);
        const namedInputType = valueTypeToType(inputType);

        if (inputType !== valueType) {
          currentTarget.setCustomValidity(
            `parsed type does not match the required type! Needed: ${namedValueType}, parsed: ${namedInputType}`
          );

          return;
        }

        currentTarget.setCustomValidity('');
        setInput(parsedValue);
      } catch {
        currentTarget.setCustomValidity('invalid input');
      }
    };

  const onSubmit: JSX.GenericEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (input === undefined) return;

    setter(input);
  };

  if (set === undefined) return null;

  return (
    <tr>
      <td>
        <b>Setter</b> <i>{set}</i>
      </td>
      <td>
        {isNull ? (
          <button onClick={() => setter(null)}>null</button>
        ) : (
          <form action="#" onSubmit={onSubmit}>
            <input placeholder={namedValueType} onChange={onChange} />
          </form>
        )}
      </td>
    </tr>
  );
};

const Child: FunctionComponent<{
  element: HierarchyElement;
  name: string;
  open: boolean;
}> = ({ name, element, open }) => {
  if (!element) return null;

  const { get, children, set } = element;
  if (get === undefined && !children && set === undefined) return null;

  return (
    <tr>
      <td colSpan={999}>
        <details open={open}>
          <Summary>
            <b>Child:</b> {name}
          </Summary>

          {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
          <Hierarchy element={element} />
        </details>
      </td>
    </tr>
  );
};

export const Hierarchy: FunctionComponent<{ element: HierarchyElement }> = ({
  element,
}) => {
  if (!element) return null;

  const { children: hierarchyChildren } = element;

  const openChildList =
    element.meta?.level === Levels.SYSTEM ||
    element.meta?.level === Levels.HOME ||
    element.meta?.level === Levels.BUILDING;

  return (
    <table>
      <Meta element={element} />
      <Getter element={element} />
      <Setter element={element} />
      {hierarchyChildren
        ? Object.entries(hierarchyChildren).map(([name, child]) => (
            <Child name={name} element={child} open={openChildList} />
          ))
        : null}
    </table>
  );
};

export const Diagnostics: FunctionComponent = () => {
  const isDesktop = useBreakpoint(useMediaQuery(dimensions.breakpoint));

  const isVisible = useVisibility();

  const flags = useFlags();

  // prettier-ignore
  const {
    country,
    language,
    locale,
    translation,
    translationLanguage
  } = useI18n();

  const isMenuVisible = useIsMenuVisible();

  const hierarchy = useHierarchy();
  const {
    building: [building],
    home: [home],
    floor: [floor],
    room: [room],
    staticPage: [staticPage],
  } = useNavigation();

  const homes = useLevel(Levels.HOME, hierarchy);
  const buildings = useLevel(Levels.BUILDING, home);
  const floors = useLevel(Levels.FLOOR, building);
  const rooms = useLevel(Levels.ROOM, floor);

  const fallbackNotification = useNotification();

  const theme = useTheme();

  const isStreamOnline = useStreamOnline();

  return (
    <DiagnosticsContainer>
      <RefreshButton onClick={() => triggerUpdate?.()}>Refresh</RefreshButton>

      <table>
        <tr>
          <td>
            <b>stream</b>
          </td>
          <td>{JSON.stringify(isStreamOnline)}</td>
        </tr>

        <tr>
          <td>
            <b>menu visible</b>
          </td>
          <td>{JSON.stringify(isMenuVisible)}</td>
        </tr>

        <tr>
          <td>
            <b>isDesktop</b>
          </td>
          <td>{JSON.stringify(isDesktop)}</td>
        </tr>

        <tr>
          <td>
            <b>isVisible</b>
          </td>
          <td>{JSON.stringify(isVisible)}</td>
        </tr>

        <tr>
          <td>
            <b>theme</b>
          </td>
          <td>{JSON.stringify(theme)}</td>
        </tr>

        <tr>
          <td colSpan={999}>
            <details>
              <Summary>
                <b>i18n</b>
              </Summary>

              <table>
                <tr>
                  <td>country</td>
                  <td>{JSON.stringify(country)}</td>
                </tr>
                <tr>
                  <td>language</td>
                  <td>{JSON.stringify(language)}</td>
                </tr>
                <tr>
                  <td>locale</td>
                  <td>{JSON.stringify(locale)}</td>
                </tr>
              </table>

              <table>
                <tr>
                  <td>{translationLanguage}</td>
                </tr>
                <tr>
                  <td>
                    <pre>
                      {useMemo(
                        () => JSON.stringify(translation, undefined, 2),
                        [translation]
                      )}
                    </pre>
                  </td>
                </tr>
              </table>
            </details>
          </td>
        </tr>

        <tr>
          <td colSpan={999}>
            <details>
              <Summary>
                <b>flags</b>
              </Summary>

              <table>
                {Object.entries(flags).map(([key, value]) => (
                  <tr>
                    <td>{key}</td>
                    <td>{JSON.stringify(value)}</td>
                  </tr>
                ))}
              </table>
            </details>
          </td>
        </tr>

        <tr>
          <td colSpan={999}>
            <details>
              <Summary>
                <b>navigation</b>
              </Summary>

              <table>
                <tr>
                  <td>home</td>
                  <td>
                    <pre>
                      {useMemo(
                        () =>
                          JSON.stringify(
                            {
                              elements: homes.map(({ meta }) => meta),
                              state: home?.meta || null,
                            },
                            undefined,
                            2
                          ),
                        [home, homes]
                      )}
                    </pre>
                  </td>
                </tr>
                <tr>
                  <td>building</td>
                  <td>
                    <pre>
                      {useMemo(
                        () =>
                          JSON.stringify(
                            {
                              elements: buildings.map(({ meta }) => meta),
                              state: building?.meta || null,
                            },
                            undefined,
                            2
                          ),
                        [building, buildings]
                      )}
                    </pre>
                  </td>
                </tr>
                <tr>
                  <td>floor</td>
                  <td>
                    <pre>
                      {useMemo(
                        () =>
                          JSON.stringify(
                            {
                              elements: floors.map(({ meta }) => meta),
                              state: floor?.meta || null,
                            },
                            undefined,
                            2
                          ),
                        [floor, floors]
                      )}
                    </pre>
                  </td>
                </tr>
                <tr>
                  <td>room</td>
                  <td>
                    <pre>
                      {useMemo(
                        () =>
                          JSON.stringify(
                            {
                              elements: rooms.map(({ meta }) => meta),
                              state: room?.meta || null,
                            },
                            undefined,
                            2
                          ),
                        [room, rooms]
                      )}
                    </pre>
                  </td>
                </tr>
                <tr>
                  <td>staticPage</td>
                  <td>
                    <pre>
                      {useMemo(
                        () =>
                          JSON.stringify(
                            {
                              elements: {
                                staticPagesBottom,
                                staticPagesTop,
                              },
                              state: staticPage,
                            },
                            undefined,
                            2
                          ),
                        [staticPage]
                      )}
                    </pre>
                  </td>
                </tr>
              </table>
            </details>
          </td>
        </tr>

        {fallbackNotification ? (
          <tr>
            <td colSpan={999}>
              <details>
                <Summary>
                  <b>fallback notification</b>
                </Summary>

                <table>
                  <tr>
                    <td>title</td>
                    <td>{JSON.stringify(fallbackNotification.title)}</td>
                  </tr>
                  <tr>
                    <td>body</td>
                    <td>{JSON.stringify(fallbackNotification.body)}</td>
                  </tr>
                </table>
              </details>
            </td>
          </tr>
        ) : null}
      </table>

      {hierarchy ? <Hierarchy element={hierarchy} /> : null}
    </DiagnosticsContainer>
  );
};
