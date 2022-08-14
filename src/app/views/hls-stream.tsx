import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { FunctionComponent } from 'preact';
import type Hls from 'hls.js';
import { Video } from '../components/video.js';
import { useIsScreensaverActive } from '../state/screensaver.js';
import { useUMDModule } from '../hooks/use-umd-module.js';
import { useVisibility } from '../state/visibility.js';

export const HLSStream: FunctionComponent<{ playlist?: string }> = ({
  playlist,
}) => {
  const [isFunctional, setFunctional] = useState(true);

  const isVisible = useVisibility();
  const isScreensaverActive = useIsScreensaverActive();

  const effectiveSrc =
    isFunctional && isVisible && !isScreensaverActive ? playlist : undefined;

  const HLS = useUMDModule<typeof Hls>('/js/lib/hls.js/dist/hls.js');

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!effectiveSrc || !HLS) return undefined;

    const { current: video } = videoRef;
    if (!video) return undefined;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = effectiveSrc;
      return () => URL.revokeObjectURL(effectiveSrc);
    }

    if (HLS.isSupported()) {
      const hls = new HLS({
        xhrSetup: (xhr) => (xhr.withCredentials = true),
      });

      hls.loadSource(effectiveSrc);
      hls.attachMedia(video);

      const onAbort = () => {
        hls.detachMedia();
        hls.destroy();
        URL.revokeObjectURL(effectiveSrc);
      };

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
              onAbort();
              setFunctional(false);
              break;
          }
        }
      });

      return onAbort;
    }

    return undefined;
  }, [effectiveSrc, HLS]);

  const onClick = useCallback(() => setFunctional(true), []);

  return isFunctional ? (
    <Video
      autoPlay={true}
      muted={true}
      onClick={onClick}
      playsInline={true}
      ref={videoRef}
    />
  ) : null;
};
