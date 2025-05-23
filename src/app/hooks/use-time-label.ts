import { useEffect, useMemo, useState } from 'preact/hooks';

import { $i18n, getTranslation } from '../state/translation.js';
import { $flags } from '../util/flags.js';

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
  incrementCb?: () => number,
): Date | undefined => {
  const [compareDate, setCompareDate] = useState(() => new Date());
  useEffect(() => {
    const timeout = incrementCb
      ? setTimeout(() => setCompareDate(new Date()), incrementCb())
      : undefined;

    return () => {
      if (!timeout) return;
      clearTimeout(timeout);
    };
  }, [compareDate, incrementCb]);

  return incrementCb ? compareDate : undefined;
};

const $nowLabel = getTranslation('now');

export const useRelativeTimeLabel = (
  date?: Date,
  nowSpan = 4000,
): string | undefined => {
  const {
    value: { translationLanguage, translationLocale },
  } = $i18n;
  const effectiveLocale = useMemo(
    () => translationLocale || translationLanguage,
    [translationLanguage, translationLocale],
  );

  const relativeTimeFormat = useMemo(
    () => new Intl.RelativeTimeFormat(effectiveLocale),
    [effectiveLocale],
  );

  const nowLabel = $nowLabel.value;

  const compareDate = useTimeIncrement(date ? nextSecondIncrement : undefined);

  return useMemo(() => {
    if (!date || !compareDate) return undefined;

    const diff = date.getTime() - compareDate.getTime();
    if (Number.isNaN(diff)) return undefined;

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

export const useAbsoluteTimeLabel = (date?: Date): string | undefined => {
  const {
    value: { translationLanguage, translationLocale },
  } = $i18n;
  const effectiveLocale = useMemo(
    () => translationLocale || translationLanguage,
    [translationLanguage, translationLocale],
  );

  const nextDay = useTimeIncrement(date ? nextDayIncrement : undefined);

  return useMemo(() => {
    if (!date || !nextDay) return undefined;

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
  date?: Date,
  nowSpan?: number,
): string | undefined => {
  const absoluteTimes = $flags.absoluteTimes.value;

  const relativeLabel = useRelativeTimeLabel(
    absoluteTimes ? undefined : date,
    nowSpan,
  );
  const absoluteLabel = useAbsoluteTimeLabel(absoluteTimes ? date : undefined);

  return absoluteTimes ? absoluteLabel : relativeLabel;
};

export const useTimeSpan = (
  a?: Date,
  b?: Date,
): [number | undefined, number | undefined] => {
  const compare = useTimeIncrement(a && b ? nextSecondIncrement : undefined);

  const [start, end] = useMemo(() => {
    if (!a || !b) return [undefined, undefined];

    const aTime = a.getTime();
    const bTime = b.getTime();

    if (aTime < bTime) return [a, b];
    return [b, a];
  }, [a, b]);

  const totalTime = useMemo(
    () => (end && start ? end.getTime() - start.getTime() : undefined),
    [end, start],
  );

  const elapsedTime = useMemo(
    () => (compare && start ? compare.getTime() - start.getTime() : undefined),
    [compare, start],
  );

  const fraction = useMemo(
    () => (elapsedTime && totalTime ? elapsedTime / totalTime : undefined),
    [elapsedTime, totalTime],
  );

  return useMemo(() => [totalTime, fraction], [fraction, totalTime]);
};

export const useDateFromEpoch = (input?: number): Date | undefined =>
  useMemo(() => (input === undefined ? undefined : new Date(input)), [input]);
