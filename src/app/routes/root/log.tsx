import { ensureKeys } from '@mrpelz/misc-utils/oop';
import { computed } from '@preact/signals';
import { FunctionComponent } from 'preact';
import { useCallback, useEffect } from 'preact/hooks';

import { Tag } from '../../components/controls.js';
import { DiagnosticsContainer, Pre } from '../../components/diagnostics.js';
import { HorizontalSwipe } from '../../components/horizontal-swipe.js';
import { Separator, Tail } from '../../components/tail.js';
import { Pointer } from '../../components/text.js';
import { useArrayStream } from '../../hooks/use-array-stream.js';
import { useAbsoluteTimeLabel } from '../../hooks/use-time-label.js';
import { colors } from '../../style.js';
import { flags$ } from '../../util/flags.js';
import { baseUrl as baseUrl_ } from '../../util/path.js';

export type Log = [
  string,
  {
    body: string;
    date: { date: string; epoch: number };
    head: string;
    level: number;
  },
];

const logLevelNames = [
  'EMERGENCY',
  'ALERT',
  'CRITICAL',
  'ERROR',
  'WARNING',
  'NOTICE',
  'INFO',
  'DEBUG',
];

export const logSeparator = Symbol('logSeparator');

const LogItem: FunctionComponent<{ log: Log }> = ({ log }) => {
  const [, { date: { epoch } = {}, body, head, level } = {}] = log ?? [];
  const date = useAbsoluteTimeLabel(epoch ? new Date(epoch) : undefined);

  return (
    <>
      {date}: {head}
      {head}
      {'\n'}[{level ? (logLevelNames.at(level) ?? '') : ''}] {body}
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

export const getLogCursor = (
  newLogs: (Log | typeof logSeparator)[],
  lastUrl: URL,
): URL | undefined => {
  const lastLog = newLogs.at(-1);
  const cursor =
    lastLog === logSeparator
      ? (newLogs.at(-2) as Log | undefined)?.[0]
      : lastLog?.[0];

  if (!cursor) return undefined;

  const nextUrl = new URL(lastUrl);
  nextUrl.searchParams.set('cursor', cursor);

  return nextUrl;
};

const baseUrl = computed(
  () => new URL('/api/log', flags$.apiBaseUrl.value ?? baseUrl_.href).href,
);

export const Log: FunctionComponent = () => {
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

  return (
    <>
      <Tail>
        <DiagnosticsContainer>
          <Pre>
            {logs.map((log) => {
              if (log === logSeparator) {
                return <Separator key={log.toString()} />;
              }

              return (
                <LogItem
                  key={log.toString()}
                  log={log}
                />
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
      </HorizontalSwipe>
    </>
  );
};
