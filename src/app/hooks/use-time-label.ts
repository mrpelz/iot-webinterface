import { useEffect, useMemo, useState } from 'preact/hooks';

import { $i18n, getTranslation } from '../state/translation.js';
import { $flags } from '../util/flags.js';
import { getSignal } from '../util/signal.js';

const units = [
  'second',
  'minute',
  'hour',
  'day',
  'week',
  'month',
  'year',
] as const;

type Unit = (typeof units)[number];

const epochs = (() => {
  const second = 1000;
  const minute = 60 * second;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  return {
    day,
    hour,
    minute,
    month,
    second,
    week,
    year,
  };
})();

export const msToNextSecond = (increaseSeconds: number): number => {
  const next = new Date();
  next.setSeconds(next.getSeconds() + increaseSeconds, 0);

  return next.getTime() - Date.now();
};

export const msToNextMinute = (increaseMinute: number): number => {
  const next = new Date();
  next.setMinutes(next.getMinutes() + increaseMinute, 0, 0);

  return next.getTime() - Date.now();
};

export const msToNextDay = (increaseDays: number): number => {
  const next = new Date();
  next.setHours(0, 0, 0, 0);
  next.setDate(next.getDate() + increaseDays);

  return next.getTime() - Date.now();
};

export const nextSecondIncrement = (): number => msToNextSecond(1);
export const nextMinuteIncrement = (): number => msToNextMinute(1);
export const nextDayIncrement = (): number => msToNextDay(1);

export const useTimeIncrement = (
  incrementCb: (() => number) | null = null,
): Date | null => {
  const [compareDate, setCompareDate] = useState(() => new Date());
  useEffect(() => {
    const timeout = incrementCb
      ? setTimeout(() => setCompareDate(new Date()), incrementCb())
      : null;

    return () => {
      if (!timeout) return;
      clearTimeout(timeout);
    };
  }, [compareDate, incrementCb]);

  return incrementCb ? compareDate : null;
};

const $nowLabel = getTranslation('now');

export const useRelativeTimeLabel = (
  date: Date | null,
  nowSpan = 4000,
): string | null => {
  const { translationLanguage, translationLocale } = getSignal($i18n);
  const effectiveLocale = useMemo(
    () => translationLocale || translationLanguage,
    [translationLanguage, translationLocale],
  );

  const relativeTimeFormat = useMemo(
    () => new Intl.RelativeTimeFormat(effectiveLocale),
    [effectiveLocale],
  );

  const nowLabel = getSignal($nowLabel);

  const compareDate = useTimeIncrement(date ? nextSecondIncrement : null);

  return useMemo(() => {
    if (!date || !compareDate) return null;

    const diff = date.getTime() - compareDate.getTime();
    const delta = Math.abs(diff);

    if (delta <= nowSpan) return nowLabel;

    let matchingUnit: Unit = 'second';

    for (const unit of units) {
      const epoch = epochs[unit];
      if (epoch > delta) break;

      matchingUnit = unit;
    }

    const value = Math.round(diff / epochs[matchingUnit]);

    return relativeTimeFormat.format(
      matchingUnit === 'second' && !value ? 1 : value,
      matchingUnit,
    );
  }, [compareDate, date, nowLabel, nowSpan, relativeTimeFormat]);
};

export const useAbsoluteTimeLabel = (date: Date | null): string | null => {
  const { translationLanguage, translationLocale } = getSignal($i18n);
  const effectiveLocale = useMemo(
    () => translationLocale || translationLanguage,
    [translationLanguage, translationLocale],
  );

  const nextDay = useTimeIncrement(date ? nextDayIncrement : null);

  return useMemo(() => {
    if (!date || !nextDay) return null;

    const isSameDay =
      date.getDate() === nextDay.getDate() &&
      date.getMonth() === nextDay.getMonth() &&
      date.getFullYear() === nextDay.getFullYear();

    const timeString = date.toLocaleTimeString(effectiveLocale);

    return isSameDay
      ? timeString
      : `${date.toLocaleDateString(effectiveLocale, {
          dateStyle: 'medium',
        })}, ${timeString}`;
  }, [date, effectiveLocale, nextDay]);
};

export const useTimeLabel = (
  date: Date | null,
  nowSpan?: number,
): string | null => {
  const absoluteTimes = getSignal($flags.absoluteTimes);

  const relativeLabel = useRelativeTimeLabel(
    absoluteTimes ? null : date,
    nowSpan,
  );
  const absoluteLabel = useAbsoluteTimeLabel(absoluteTimes ? date : null);

  return absoluteTimes ? absoluteLabel : relativeLabel;
};

export const useTimeSpan = (
  a: Date | null,
  b: Date | null,
): [number | null, number | null] => {
  const compare = useTimeIncrement(a && b ? nextSecondIncrement : null);

  const [start, end] = useMemo(() => {
    if (!a || !b) return [null, null];

    const aTime = a.getTime();
    const bTime = b.getTime();

    if (aTime < bTime) return [a, b];
    return [b, a];
  }, [a, b]);

  const totalTime = useMemo(
    () => (end && start ? end.getTime() - start.getTime() : null),
    [end, start],
  );

  const elapsedTime = useMemo(
    () => (compare && start ? compare.getTime() - start.getTime() : null),
    [compare, start],
  );

  const fraction = useMemo(
    () => (elapsedTime && totalTime ? elapsedTime / totalTime : null),
    [elapsedTime, totalTime],
  );

  return useMemo(() => [totalTime, fraction], [fraction, totalTime]);
};

export const useDateFromEpoch = (input: number | null): Date | null =>
  useMemo(() => (input === null ? null : new Date(input)), [input]);
