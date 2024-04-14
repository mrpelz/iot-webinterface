import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import {
  Screensaver as ScreensaverComponent,
  Time,
} from '../components/screensaver.js';
import {
  nextMinuteIncrement,
  useTimeIncrement,
} from '../hooks/use-time-label.js';
import {
  $isScreensaverActive,
  flipScreensaverActive,
} from '../state/screensaver.js';
import { $i18n } from '../state/translation.js';
import { $flags } from '../util/flags.js';
import { getSignal } from '../util/signal.js';

const nextMinutePlusDelayIncrement = () => nextMinuteIncrement() + 50;

export const Screensaver: FunctionComponent = () => {
  const { country, translationLocale } = getSignal($i18n);
  const effectiveLocale = useMemo(
    () => translationLocale || country,
    [country, translationLocale],
  );

  const { value: isScreensaverPositionRandomized } =
    $flags.screensaverRandomizePosition;

  const isScreensaverActive = getSignal($isScreensaverActive);

  const nextMinute = useTimeIncrement(
    isScreensaverActive ? nextMinutePlusDelayIncrement : null,
  );

  const [date = null, time = null, x = 0, y = 0] = useMemo(() => {
    if (!effectiveLocale || !nextMinute) return [];

    const now = new Date();

    return [
      `${now.toLocaleTimeString(effectiveLocale, {
        hour: '2-digit',
        hour12: false,
        minute: '2-digit',
      })}`,
      `${now.toLocaleDateString(effectiveLocale, {
        day: '2-digit',
        month: '2-digit',
        weekday: 'long',
        year: 'numeric',
      })}`,
      isScreensaverPositionRandomized ? Math.random() : 0.5,
      isScreensaverPositionRandomized ? Math.random() : 0.5,
    ] as const;
  }, [effectiveLocale, isScreensaverPositionRandomized, nextMinute]);

  return (
    <ScreensaverComponent
      isVisible={isScreensaverActive}
      onClick={flipScreensaverActive}
    >
      {isScreensaverActive ? (
        <Time x={x} y={y}>
          {date}
          <br />
          {time}
        </Time>
      ) : null}
    </ScreensaverComponent>
  );
};
