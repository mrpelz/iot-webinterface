import { FunctionComponent } from 'preact';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';

import { PauseIcon, PlayIcon } from '../components/icons.js';
import { Video } from '../components/video.js';
import { usePromise } from '../hooks/use-promise.js';
import { msToNextSecond, useTimeIncrement } from '../hooks/use-time-label.js';
import { $isFocused } from '../state/focus.js';
import { $isScreensaverActive } from '../state/screensaver.js';
import { dimensions } from '../style.js';
import { fetchFallback } from '../util/fetch.js';
import { getSignal } from '../util/signal.js';
import { Category } from './category.js';
import { Translation } from './translation.js';

const next10thSecondIncrement = (): number => msToNextSecond(10);
const next2ndSecondIncrement = (): number => msToNextSecond(2);

export const HLSStream: FunctionComponent<{
  poster?: string;
  src?: string;
}> = ({ poster, src }) => {
  const [isActive, setActive] = useState(false);

  const isFocused = getSignal($isFocused);
  const isScreensaverActive = getSignal($isScreensaverActive);

  useEffect(() => {
    if (isFocused && !isScreensaverActive) return;

    setActive(false);
  }, [isFocused, isScreensaverActive]);

  const effectiveSrc = useMemo(
    () => (isActive ? src : undefined),
    [isActive, src],
  );

  const HLS = usePromise(() => import(/* webpackChunkName: "hls" */ 'hls.js'))
    ?.default?.default;
  // const HLS = useUMDModule<typeof HLT_t.default>('/modules/hls.js');

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const { current: video } = videoRef;
    if (!video) return undefined;

    const abort = new AbortController();

    video.addEventListener(
      'error',
      () => {
        if (video.src.length === 0) return;
        setActive(false);
      },
      { signal: abort.signal },
    );

    return () => abort.abort();
  }, []);

  useEffect(() => {
    const { current: video } = videoRef;
    if (!video) return undefined;

    if (
      ['maybe', 'probably'].includes(
        video.canPlayType('application/vnd.apple.mpegurl'),
      ) &&
      !navigator.userAgent.toLowerCase().includes('android')
    ) {
      video.src = effectiveSrc || '';
      if (effectiveSrc) {
        video.play().catch(() => {
          // noop
        });
      }

      return () => {
        if (!effectiveSrc) return;

        try {
          video.pause();
        } catch {
          // noop
        }

        video.src = '';
        URL.revokeObjectURL(effectiveSrc);
      };
    }

    if (!HLS || !effectiveSrc) return undefined;

    if (HLS.isSupported()) {
      const hls = new HLS({
        xhrSetup: (xhr) => {
          xhr.setRequestHeader('x-sw-skip', '1');
          xhr.withCredentials = false;
        },
      });

      hls.loadSource(effectiveSrc);
      hls.attachMedia(video);

      video.play().catch(() => {
        // noop
      });

      hls.on(HLS.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setActive(false);
        }
      });

      return () => {
        try {
          video.pause();
        } catch {
          // noop
        }

        hls.detachMedia();
        hls.destroy();
        URL.revokeObjectURL(effectiveSrc);
      };
    }

    return undefined;
  }, [effectiveSrc, HLS]);

  const [posterUrl, setPosterUrl] = useState('');

  const refreshHandler = useMemo(
    () => (effectiveSrc ? next10thSecondIncrement : next2ndSecondIncrement),
    [effectiveSrc],
  );

  const nextPosterRefresh = useTimeIncrement(poster ? refreshHandler : null);

  useEffect(() => {
    if (!poster || !nextPosterRefresh) return undefined;

    (async () => {
      const [response] = await fetchFallback(poster, undefined, {
        credentials: 'omit',
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'x-sw-skip': '1',
        },
      });
      if (!response) return;

      const blob = await response.blob();

      setPosterUrl(URL.createObjectURL(blob));
    })();

    return () => URL.revokeObjectURL(posterUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, nextPosterRefresh, poster]);

  const onClick = useCallback(() => setActive((state) => !state), []);

  return (
    <Category
      header={
        <>
          <Translation i18nKey="surveillance" capitalize={true} />{' '}
          <Translation i18nKey="is" />{' '}
          {effectiveSrc ? (
            <PlayIcon height={dimensions.fontSizeSmall} viewBox="0 -2 24 24" />
          ) : (
            <PauseIcon height={dimensions.fontSizeSmall} viewBox="0 -2 24 24" />
          )}
        </>
      }
    >
      <Video
        autoPlay={true}
        loop={false}
        muted={true}
        onClick={onClick}
        playsInline={true}
        poster={posterUrl}
        ref={videoRef}
      />
    </Category>
  );
};
