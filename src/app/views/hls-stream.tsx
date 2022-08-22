import { PauseIcon, PlayIcon } from '../components/icons.js';
import { msToNextSecond, useTimeIncrement } from '../hooks/use-time-label.js';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';
import { Category } from './category.js';
import { FunctionComponent } from 'preact';
import type HLT_t from 'hls.js';
import { Translation } from '../state/i18n.js';
import { Video } from '../components/video.js';
import { dimensions } from '../style.js';
import { fetchFallback } from '../util/fetch.js';
import { useFocus } from '../state/focus.js';
import { useIsScreensaverActive } from '../state/screensaver.js';
import { useUMDModule } from '../hooks/use-umd-module.js';

const next10thSecondIncrement = (): number => msToNextSecond(10);
const next2ndSecondIncrement = (): number => msToNextSecond(2);

export const HLSStream: FunctionComponent<{
  poster?: string;
  src?: string;
}> = ({ poster, src }) => {
  const [isActive, setActive] = useState(false);

  const isFocused = useFocus();
  const isScreensaverActive = useIsScreensaverActive();

  useEffect(() => {
    if (isFocused && !isScreensaverActive) return;

    setActive(false);
  }, [isFocused, isScreensaverActive]);

  const effectiveSrc = useMemo(
    () => (isActive ? src : undefined),
    [isActive, src]
  );

  const HLS = useUMDModule<typeof HLT_t>('/js/lib/hls.js/dist/hls.js');

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.addEventListener('error', () => setActive(false));
    videoRef.current?.addEventListener('stalled', () => setActive(false));
  }, []);

  useEffect(() => {
    const { current: video } = videoRef;
    if (!video) return undefined;

    if (
      video.canPlayType('application/vnd.apple.mpegurl') &&
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
          xhr.withCredentials = true;
        },
      });

      hls.loadSource(effectiveSrc);
      hls.attachMedia(video);

      video.play().catch(() => {
        // noop
      });

      hls.on(HLS.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case HLS.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case HLS.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              setActive(false);
              break;
          }
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
    [effectiveSrc]
  );

  const nextPosterRefresh = useTimeIncrement(poster ? refreshHandler : null);

  useEffect(() => {
    if (!poster || !nextPosterRefresh) return undefined;

    (async () => {
      const [response] = await fetchFallback(poster);
      if (!response) return;

      const blob = await response.blob();

      setPosterUrl(URL.createObjectURL(blob));
    })();

    return () => URL.revokeObjectURL(posterUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextPosterRefresh, poster]);

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
