import { ensureKeys } from '@mrpelz/misc-utils/oop';
import { computed } from '@preact/signals';
import { FunctionComponent } from 'preact';

import { DiagnosticsContainer, Pre } from '../../components/diagnostics.js';
import { Tail } from '../../components/tail.js';
import { useArrayStream } from '../../hooks/use-array-stream.js';
import { useAbsoluteTimeLabel } from '../../hooks/use-time-label.js';
import { $flags } from '../../util/flags.js';

export type Log = [
  string,
  {
    body: string;
    date: { date: string; epoch: number };
    head: string;
    level: number;
  },
];

const LogItem: FunctionComponent<{ log: Log }> = ({ log }) => {
  const [, { date: { epoch } = {}, body, head, level } = {}] = log ?? [];
  const date = useAbsoluteTimeLabel(epoch ? new Date(epoch) : undefined);

  return (
    <>
      {date}: {head}
      {head}
      {'\n'}[{level}] {body}
      {'\n\n'}
    </>
  );
};

export const isLogs = (input: unknown[]): input is Log[] => {
  for (const log of input) {
    if (!Array.isArray(log)) return false;
    const [key, value] = log;

    if (typeof key !== 'string') return false;
    if (typeof value !== 'object') return false;

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
      return false;
    }

    const { date: dateDate, epoch } = ensureKeys(date, 'date', 'epoch');
    if (dateDate === undefined || epoch === undefined) return false;
  }

  return true;
};

export const getLogCursor = (newLogs: Log[], lastUrl: URL): URL | undefined => {
  const cursor = newLogs.at(-1)?.[0];
  if (!cursor) return undefined;

  const nextUrl = new URL(lastUrl);
  nextUrl.searchParams.set('cursor', cursor);

  return nextUrl;
};

const baseUrl = computed(
  () => new URL('/api/log', $flags.apiBaseUrl.value ?? self.location.href).href,
);

export const Log: FunctionComponent = () => {
  const logs = useArrayStream<Log>(baseUrl.value, isLogs, getLogCursor);

  return (
    <Tail>
      <DiagnosticsContainer>
        <Pre>
          {logs.map((log) => (
            <LogItem log={log} />
          ))}
        </Pre>
      </DiagnosticsContainer>
    </Tail>
  );
};
