import { ensureKeys } from '@mrpelz/misc-utils/oop';
import { computed } from '@preact/signals';
import { createContext, FunctionComponent } from 'preact';
import {
  Dispatch,
  StateUpdater,
  useContext,
  useEffect,
  useState,
} from 'preact/hooks';

import { useAbsoluteTimeLabel } from '../hooks/use-time-label.js';
import { $flags } from '../util/flags.js';
import { Tokenize, Tokens } from './tokenize.js';

export type Log = [
  string,
  {
    body: string;
    date: { date: string; epoch: number };
    head: string;
    level: number;
  },
];

const INTERVAL = 1000;

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

export const LogStream: FunctionComponent<{
  interval?: number;
  url: string;
}> = ({ interval = INTERVAL, url }) => {
  const { value: baseUrl } = computed(
    () => new URL(url, $flags.apiBaseUrl.value ?? self.location.href).href,
  );

  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    const abort = new AbortController();

    let cursor: string | undefined;

    const fn = () => {
      const cursorUrl = (() => {
        const result = new URL(baseUrl);
        if (cursor) result.searchParams.set('cursor', cursor);

        return result;
      })();

      fetch(cursorUrl, { signal: abort.signal })
        .then((response) =>
          response.ok ? (response.json() as Promise<Log[]>) : undefined,
        )
        .then((newLogs) => {
          if (newLogs === undefined) {
            cursor = undefined;
            setLogs([]);

            return;
          }

          for (const log of newLogs) {
            if (!Array.isArray(log)) return;
            const [key, value] = log;

            if (typeof key !== 'string') return;
            if (typeof value !== 'object') return;

            const { body, date, head, level } = ensureKeys(
              value,
              'body',
              'date',
              'head',
              'level',
            );
            if (
              body === undefined ||
              date === undefined ||
              head === undefined ||
              level === undefined
            ) {
              return;
            }

            const { date: dateDate, epoch } = ensureKeys(date, 'date', 'epoch');
            if (dateDate === undefined || epoch === undefined) return;
          }

          const nextCursor = newLogs.at(-1)?.[0];
          if (nextCursor && nextCursor !== cursor) {
            cursor = nextCursor;
            setLogs((oldLogs) => [oldLogs, newLogs].flat());
          }
        })
        .catch();
    };

    fn();
    const interval_ = setInterval(fn, interval);

    return () => {
      try {
        abort.abort();
      } catch {
        //
      }
      if (interval_) clearInterval(interval_);
    };
  }, [baseUrl, interval]);

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
