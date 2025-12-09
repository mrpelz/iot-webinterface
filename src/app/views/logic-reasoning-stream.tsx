import { computed } from '@preact/signals';
import { createContext, FunctionComponent } from 'preact';
import { Dispatch, StateUpdater, useContext, useState } from 'preact/hooks';

import { useLogStream } from '../hooks/use-array-stream.js';
import { useAbsoluteTimeLabel } from '../hooks/use-time-label.js';
import { $flags } from '../util/flags.js';
import { getLogCursor, isLogs, Log } from './log-stream.js';
import { Tokenize, Tokens } from './tokenize.js';

const matchHierarchyPath = new RegExp(
  String.raw`(?:(?:[a-zA-Zß][a-zA-Z0-9ß]*\.)+[a-zA-Zß][a-zA-Z0-9ß]*)`,
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

  const [, { date: { epoch } = {}, body, head, level } = {}] = log ?? [];
  const date = useAbsoluteTimeLabel(epoch ? new Date(epoch) : undefined);

  return (
    <>
      {date}:{' '}
      <a onClick={() => setHeadFilter((filter) => (filter ? undefined : head))}>
        {head}
      </a>
      {'\n'}[{level}] {body ? <Tokenize input={body} tokens={tokens} /> : null}
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

export const LogicReasoningStream: FunctionComponent = () => {
  const logs = useLogStream<Log>(baseUrl.value, isLogs, getLogCursor);

  const [headFilter, setHeadFilter] = useState<string>();

  return (
    <pre>
      {logs.map((log) => {
        if (headFilter && log[1].head !== headFilter) return null;

        return (
          <LogContext.Provider value={log}>
            <LogItem setHeadFilter={setHeadFilter} />
          </LogContext.Provider>
        );
      })}
    </pre>
  );
};
