import { computed } from '@preact/signals';
import { createContext, FunctionComponent } from 'preact';
import {
  Dispatch,
  StateUpdater,
  useContext,
  useMemo,
  useState,
} from 'preact/hooks';

import { Tag } from '../../components/controls.js';
import { DiagnosticsContainer, Pre } from '../../components/diagnostics.js';
import { HorizontalSwipe } from '../../components/horizontal-swipe.js';
import { Tail } from '../../components/tail.js';
import { Pointer } from '../../components/text.js';
import { useArray } from '../../hooks/use-array-compare.js';
import { useArrayStream } from '../../hooks/use-array-stream.js';
import { useAbsoluteTimeLabel } from '../../hooks/use-time-label.js';
import { $flags } from '../../util/flags.js';
import { Tokenize, Tokens } from '../../views/tokenize.js';
import { getLogCursor, isLogs, Log } from './log.js';

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
      {body ? <Tokenize input={body} tokens={tokens} /> : null}
      {'\n\n'}
    </>
  );
};

const baseUrl = computed(
  () =>
    new URL(
      '/api/logic-reasoning',
      $flags.apiBaseUrl.value ?? self.location.href,
    ).href,
);

export const LogicReasoning: FunctionComponent = () => {
  const logs = useArrayStream<Log>(baseUrl.value, isLogs, getLogCursor);

  const [headFilter, setHeadFilter] = useState<string>();

  const heads = useArray(
    useMemo(
      () => Array.from(new Set(logs.map(([, { head }]) => head))).toSorted(),
      [logs],
    ),
  );

  return (
    <>
      <Tail>
        <DiagnosticsContainer>
          <Pre>
            {logs.map((log) => {
              if (headFilter !== undefined && log[1].head !== headFilter) {
                return null;
              }

              return (
                <LogContext.Provider value={log}>
                  <LogItem setHeadFilter={setHeadFilter} />
                </LogContext.Provider>
              );
            })}
          </Pre>
        </DiagnosticsContainer>
      </Tail>
      <HorizontalSwipe>
        <a onClick={() => setHeadFilter(undefined)}>
          <Pointer>
            <Tag invert={headFilter === undefined}>✕</Tag>
          </Pointer>
        </a>
        {heads.map((head) => (
          <a onClick={() => setHeadFilter(head)}>
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
