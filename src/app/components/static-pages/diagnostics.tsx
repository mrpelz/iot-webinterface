import {
  HierarchyElement,
  Levels,
  Meta,
  ParentRelation,
  ValueType,
  isElementWithMeta,
  isMetaPropertyActuator,
  isMetaPropertySensor,
  levelToString,
  parentRelationToString,
  typeToValueType,
  valueTypeToType,
} from '../../web-api.js';
import { colors, dimensions } from '../../style.js';
import {
  staticPagesBottom,
  staticPagesTop,
  useNavigation,
} from '../../hooks/navigation.js';
import {
  useGetter,
  useSetter,
  useStreamOnline,
  useWebApi,
} from '../../hooks/web-api.js';
import { useMemo, useState } from 'preact/hooks';
import { FunctionComponent } from 'preact';
import { styled } from 'goober';
import { useBreakpoint } from '../../style/breakpoint.js';
import { useFlags } from '../../hooks/flags.js';
import { useI18n } from '../../hooks/i18n.js';
import { useIsMenuVisible } from '../../hooks/menu.js';
import { useMediaQuery } from '../../style/main.js';
import { useNotification } from '../../hooks/notification.js';
import { useTheme } from '../../hooks/theme.js';

const _DiagnosticsContainer = styled('section')`
  background-color: white;
  color: ${colors.black()};
  display: flex;
  flex-direction: column;
  font-size: 0.75rem;
  padding: 0.5rem;

  &,
  & * {
    -moz-user-select: text;
    -ms-user-select: text;
    -webkit-tap-highlight-color: text;
    -webkit-touch-callout: text;
    -webkit-user-select: text;
    user-select: text;
    white-space: break-spaces;
    word-break: break-all;
  }

  table,
  td {
    border-collapse: collapse;
    border: 1px solid currentColor;
    vertical-align: top;
  }

  table {
    margin: 0.25rem;
  }

  tr:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  td {
    padding: 0.25rem;
  }

  thead {
    font-weight: bold;
  }
`;

export const _Summary = styled('summary')`
  cursor: pointer;
`;

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
  const isLastSeen = isMetaPropertySensor(meta) && meta.name === 'lastSeen';

  const { country } = useI18n();

  const rawState = useGetter<unknown>(element);
  const state = useMemo(() => {
    return isLastSeen && country && rawState
      ? new Date(rawState as number).toLocaleString(country)
      : JSON.stringify(rawState, undefined, 2);
  }, [isLastSeen, country, rawState]);

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
          <_Summary>
            <b>Child:</b> {name}
          </_Summary>

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
  const { hierarchy } = useWebApi();
  const streamOnline = useStreamOnline();

  const flags = useFlags();
  const menuVisible = useIsMenuVisible();
  const isDesktop = useBreakpoint(useMediaQuery(dimensions.breakpoint));
  const theme = useTheme();
  const { country, language, locale, translation, translationLanguage } =
    useI18n();
  const fallbackNotification = useNotification();
  const { building, home, room, staticPage } = useNavigation();

  return (
    <_DiagnosticsContainer>
      <table>
        <tr>
          <td>
            <b>stream</b>
          </td>
          <td>{JSON.stringify(streamOnline)}</td>
        </tr>

        <tr>
          <td>
            <b>menu visible</b>
          </td>
          <td>{JSON.stringify(menuVisible)}</td>
        </tr>

        <tr>
          <td>
            <b>isDesktop</b>
          </td>
          <td>{JSON.stringify(isDesktop)}</td>
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
              <_Summary>
                <b>i18n</b>
              </_Summary>

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
              <_Summary>
                <b>flags</b>
              </_Summary>

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
              <_Summary>
                <b>navigation</b>
              </_Summary>

              <table>
                <tr>
                  <td>home</td>
                  <td>
                    <pre>
                      {useMemo(
                        () =>
                          JSON.stringify(
                            {
                              elements: home.elements.map(({ meta }) => meta),
                              state: home.state?.meta,
                            },
                            undefined,
                            2
                          ),
                        [home]
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
                              elements: building.elements.map(
                                ({ meta }) => meta
                              ),
                              state: building.state?.meta,
                            },
                            undefined,
                            2
                          ),
                        [building]
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
                              elements: room.elements.map(
                                ({ elements, floor }) => ({
                                  floor: floor.meta,
                                  rooms: elements.map(({ meta }) => meta),
                                })
                              ),
                              state: room.state?.meta || null,
                            },
                            undefined,
                            2
                          ),
                        [room]
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
                              state: staticPage.state,
                            },
                            undefined,
                            2
                          ),
                        [staticPage.state]
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
            <td>
              <details>
                <_Summary>
                  <b>fallback notification</b>
                </_Summary>

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
    </_DiagnosticsContainer>
  );
};
