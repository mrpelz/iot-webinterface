import { computed } from '@preact/signals';
import { createContext, FunctionComponent } from 'preact';
import {
  Dispatch,
  StateUpdater,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'preact/hooks';

import { Tag } from '../../components/controls.js';
import { DiagnosticsContainer, Pre } from '../../components/diagnostics.js';
import { HorizontalSwipe } from '../../components/horizontal-swipe.js';
import { Separator, Tail } from '../../components/tail.js';
import { Pointer } from '../../components/text.js';
import { useArray } from '../../hooks/use-array-compare.js';
import { useArrayStream } from '../../hooks/use-array-stream.js';
import { useLocalStorage } from '../../hooks/use-local-storage.js';
import { useAbsoluteTimeLabel } from '../../hooks/use-time-label.js';
import { colors } from '../../style.js';
import { flags$ } from '../../util/flags.js';
import { baseUrl as baseUrl_ } from '../../util/path.js';
import { Tokenize, Tokens } from '../../views/tokenize.js';
import { getLogCursor, isLogs, Log, logSeparator } from './log.js';

const matchHierarchyPath = new RegExp(
  String.raw`(?:(?:[a-zA-Zß][a-zA-Z0-9ß]*\.)+[a-zA-Zß][a-zA-Z0-9ß]*)(?=(?: |$)+)`,
  'm',
);

const LogContext = createContext<Log | undefined>(undefined);

const tokens: Tokens = new Map([
  [
    matchHierarchyPath,
    ({ value }) => {
      const log = useContext(LogContext);
      if (!log) return null;

      const [, { head }] = log;

      return (
        <u>{value.startsWith(head) ? value.slice(head.length + 1) : value}</u>
      );
    },
  ],
]);

const LogItem: FunctionComponent<{
  setHeadFilter: Dispatch<StateUpdater<string | undefined>>;
}> = ({ setHeadFilter }) => {
  const log = useContext(LogContext);

  const [, { date: { epoch } = {}, body, head } = {}] = log ?? [];
  const date = useAbsoluteTimeLabel(epoch ? new Date(epoch) : undefined);

  return (
    <>
      {date}:{' '}
      <a onClick={() => setHeadFilter((filter) => (filter ? undefined : head))}>
        <Pointer>
          <u>
            {head && head.length > 0
              ? head.match(new RegExp(String.raw`[^\.]+$`))
              : null}
          </u>
        </Pointer>
      </a>
      {'\n'}
      {body ? (
        <Tokenize
          input={body}
          tokens={tokens}
        />
      ) : null}
      {'\n\n'}
    </>
  );
};

const baseUrl = computed(
  () =>
    new URL('/api/logic-reasoning', flags$.apiBaseUrl.value ?? baseUrl_.href)
      .href,
);

export const LogicReasoning: FunctionComponent = () => {
  const { elements: logs, insert } = useArrayStream<Log | typeof logSeparator>(
    baseUrl.value,
    isLogs,
    getLogCursor,
  );

  const handleSeparatorClick = useCallback(() => {
    if (logs.at(-1) === logSeparator) return;

    insert(logSeparator);
  }, [insert, logs]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => handleSeparatorClick(), []);

  const [headFilter, setHeadFilter] = useLocalStorage<string>(
    'logic-reasoning-header-filter',
  );

  const heads = useArray(
    useMemo(
      () =>
        Array.from(
          new Set(
            logs
              .filter((log) => log !== logSeparator)
              .map(([, { head }]) => head),
          ),
        ).toSorted(),
      [logs],
    ),
  );

  return (
    <>
      <Tail>
        <DiagnosticsContainer>
          <Pre>
            {logs.map((log) => {
              if (log === logSeparator) {
                return <Separator key={log.toString()} />;
              }

              if (headFilter !== undefined && log[1].head !== headFilter) {
                return null;
              }

              return (
                <LogContext.Provider
                  key={log.toString()}
                  value={log}
                >
                  <LogItem setHeadFilter={setHeadFilter} />
                </LogContext.Provider>
              );
            })}
          </Pre>
        </DiagnosticsContainer>
      </Tail>
      <HorizontalSwipe>
        <a onClick={handleSeparatorClick}>
          <Pointer>
            <Tag
              invert
              backgroundColor={colors.selection()()}
            >
              {/* eslint-disable-next-line no-irregular-whitespace */}
              insert separator
            </Tag>
          </Pointer>
        </a>
        <a onClick={() => setHeadFilter(undefined)}>
          <Pointer>
            <Tag invert={headFilter === undefined}>✕</Tag>
          </Pointer>
        </a>
        {heads.map((head) => (
          <a
            key={head}
            onClick={() => setHeadFilter(head)}
          >
            <Pointer>
              <Tag invert={headFilter === head}>
                {head.length > 0
                  ? head.match(new RegExp(String.raw`[^\.]+$`))
                  : '""'}
              </Tag>
            </Pointer>
          </a>
        ))}
      </HorizontalSwipe>
    </>
  );
};
