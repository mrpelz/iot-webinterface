import {
  msToNextSecond,
  nextSecondIncrement,
  useTimeIncrement,
} from '../hooks/use-time-label.js';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';
import { FunctionComponent } from 'preact';
import type HLT_t from 'hls.js';
import { Video } from '../components/video.js';
import { fetchFallback } from '../util/fetch.js';
import { useFocus } from '../state/focus.js';
import { useIsScreensaverActive } from '../state/screensaver.js';
import { useUMDModule } from '../hooks/use-umd-module.js';

const next10thSecondIncrement = (): number => msToNextSecond(10);

export const HLSStream: FunctionComponent<{
  poster?: string;
  src?: string;
}> = ({ poster, src }) => {
  const [isFunctional, setFunctional] = useState(true);

  const isFocused = useFocus();
  const isScreensaverActive = useIsScreensaverActive();

  const effectiveSrc = useMemo(
    () => (isFunctional && isFocused && !isScreensaverActive ? src : undefined),
    [isFocused, isFunctional, isScreensaverActive, src]
  );

  const HLS = useUMDModule<typeof HLT_t>('/js/lib/hls.js/dist/hls.js');

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(
    () =>
      videoRef.current?.addEventListener('error', () => setFunctional(false)),
    []
  );

  useEffect(() => {
    const { current: video } = videoRef;
    if (!video) return undefined;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = effectiveSrc || '';

      return () => {
        if (!effectiveSrc) return;

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
              setFunctional(false);
              break;
          }
        }
      });

      return () => {
        hls.detachMedia();
        hls.destroy();
        URL.revokeObjectURL(effectiveSrc);
      };
    }

    return undefined;
  }, [effectiveSrc, HLS]);

  const [posterUrl, setPosterUrl] = useState('');

  const refreshHandler = useMemo(
    () => (effectiveSrc ? next10thSecondIncrement : nextSecondIncrement),
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

  const onClick = useCallback(() => setFunctional((state) => !state), []);

  return (
    <Video
      autoPlay={true}
      muted={true}
      onClick={onClick}
      playsInline={true}
      ref={videoRef}
      poster={posterUrl}
    />
  );
};
