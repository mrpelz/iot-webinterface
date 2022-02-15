import { useEffect, useMemo, useRef } from 'preact/hooks';
import {
  useNavigationRoom,
  useNavigationStaticPage,
} from '../state/navigation.js';
import { Background as BackgroundComponent } from '../components/background.js';
import { FunctionComponent } from 'preact';

const BACKGROUND_PATH = '/images/background/';
const BACKGROUND_EXTENSION = '.png';

const camelCase = new RegExp('[A-Z]', 'g');

export const Background: FunctionComponent = () => {
  const [staticPage] = useNavigationStaticPage();
  const [room] = useNavigationRoom();

  const identifier = useMemo(
    () => staticPage || room?.meta.name || null,
    [room?.meta.name, staticPage]
  );

  const path = useMemo(() => {
    if (!identifier) return null;

    const baseName = encodeURIComponent(
      identifier.replace(camelCase, (letter) => `-${letter.toLowerCase()}`)
    );

    return [BACKGROUND_PATH, baseName, BACKGROUND_EXTENSION].join('');
  }, [identifier]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { current: wrapper } = ref;
    if (!wrapper) return;

    const previous = wrapper.firstElementChild;

    const fade = async (current: HTMLElement | null) => {
      const animation = await (async () => {
        try {
          if (previous) {
            return previous.animate([{ opacity: 1 }, { opacity: 0 }], {
              duration: current ? 1000 : 500,
              fill: 'forwards',
            }).finished;
          }

          if (current) {
            return current.animate([{ opacity: 0 }, { opacity: 1 }], {
              duration: 1000,
              fill: 'forwards',
            }).finished;
          }

          return null;
        } catch {
          return null;
        }
      })();

      previous?.remove();

      if (!previous && current) animation?.commitStyles();
      animation?.cancel();
    };

    const img = path ? new Image() : null;

    if (img && path) {
      img.src = path;

      img.onload = async () => {
        await img.decode?.();

        wrapper.prepend(img);

        fade(img);
      };

      img.onerror = () => {
        fade(null);
      };
    } else {
      fade(null);
    }

    for (const child of Array.from(wrapper.childNodes)) {
      if (img && child === img) continue;
      if (previous && child === previous) continue;

      child.remove();
    }
  }, [path, ref]);

  return <BackgroundComponent ref={ref} />;
};
