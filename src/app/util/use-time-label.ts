import { useEffect, useMemo, useState } from 'preact/hooks';
import { useI18n, useI18nKey } from '../state/i18n.js';
import { useFlag } from '../state/flags.js';

const units = [
  'second',
  'minute',
  'hour',
  'day',
  'week',
  'month',
  'year',
] as const;

type Unit = typeof units[number];

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

const msToNextSecond = (increaseSeconds: number) => {
  const next = new Date();
  next.setSeconds(next.getSeconds() + increaseSeconds, 0);

  return next.getTime() - Date.now();
};

const msToNextDay = (increaseDays: number) => {
  const next = new Date();
  next.setHours(0, 0, 0, 0);
  next.setDate(next.getDate() + increaseDays);

  return next.getTime() - Date.now();
};

const nextSecondIncrement = () => msToNextSecond(1);
const nextDayIncrement = () => msToNextDay(1);

const useTimeIncrement = (incrementCb: (() => number) | null = null) => {
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

export const useRelativeTimeLabel = (
  date: Date | null,
  nowSpan = 4000
): string | null => {
  const { translationLanguage, translationLocale } = useI18n();
  const effectiveLocale = useMemo(
    () => translationLocale || translationLanguage,
    [translationLanguage, translationLocale]
  );

  const relativeTimeFormat = useMemo(
    () => new Intl.RelativeTimeFormat(effectiveLocale),
    [effectiveLocale]
  );

  const nowLabel = useI18nKey('now');

  const compareDate = useTimeIncrement(date ? nextSecondIncrement : null);

  return useMemo(() => {
    if (!date || !compareDate) return null;

    const diff = date.getTime() - compareDate.getTime();
    const delta = Math.abs(diff);

    if (delta <= nowSpan) return nowLabel;

    let matchingUnit: Unit | null = null;

    for (const unit of units) {
      const epoch = epochs[unit];
      if (epoch > delta) break;

      matchingUnit = unit;
    }

    if (!matchingUnit) return null;

    const value = Math[diff < 0 ? 'ceil' : 'floor'](
      diff / epochs[matchingUnit]
    );

    return relativeTimeFormat.format(value, matchingUnit);
  }, [compareDate, date, nowLabel, nowSpan, relativeTimeFormat]);
};

export const useAbsoluteTimeLabel = (date: Date | null): string | null => {
  const { translationLanguage, translationLocale } = useI18n();
  const effectiveLocale = useMemo(
    () => translationLocale || translationLanguage,
    [translationLanguage, translationLocale]
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

export const useTimeLabel = (date: Date | null): string | null => {
  const absoluteTimes = useFlag('absoluteTimes');

  const relativeLabel = useRelativeTimeLabel(absoluteTimes ? null : date);
  const absoluteLabel = useAbsoluteTimeLabel(absoluteTimes ? date : null);

  return absoluteTimes ? absoluteLabel : relativeLabel;
};
