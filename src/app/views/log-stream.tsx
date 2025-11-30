import { computed } from '@preact/signals';
import { FunctionComponent } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';

import { $flags } from '../util/flags.js';

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

export const LogStream: FunctionComponent<{
  url: string;
}> = ({ url }) => {
  const { value: baseUrl } = computed(
    () => new URL(url, $flags.apiBaseUrl.value ?? self.location.href).href,
  );

  const [cursor, setCursor] = useState<string>();
  const cursorUrl = useMemo(() => {
    const result = new URL(baseUrl);
    if (cursor) result.searchParams.set('cursor', cursor);

    return result.href;
  }, [baseUrl, cursor]);

  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    const abort = new AbortController();

    const interval = setInterval(() => {
      fetch(cursorUrl, { signal: abort.signal })
        .then((response) => response.json() as Promise<Log[]>)
        .then((newLogs) => {
          setLogs((oldLogs) => [oldLogs, newLogs].flat());

          const nextCursor = newLogs.at(-1)?.[0];
          if (nextCursor) setCursor(nextCursor);
        })
        .catch();
    }, INTERVAL);

    return () => {
      abort.abort();
      clearInterval(interval);
    };
  }, [cursorUrl]);

  return (
    <pre>
      {logs.map(
        ([
          ,
          {
            date: { date },
            body,
            head,
            level,
          },
        ]) => `${date}: ${head}\n[${level}] ${body}\n\n`,
      )}
    </pre>
  );
};
