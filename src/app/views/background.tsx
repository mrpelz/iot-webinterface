import { FunctionComponent } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

import { Background as BackgroundComponent } from '../components/background.js';
import { useBackground } from '../state/background.js';

export const Background: FunctionComponent = () => {
  const background = useBackground();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const previousRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const { current: wrapper } = wrapperRef;
    if (!wrapper) return;

    const { current: previous } = previousRef;

    const fade = async (current: HTMLElement | null) => {
      const animation = await (async () => {
        try {
          if (previous) {
            return previous.animate([{ opacity: 1 }, { opacity: 0 }], {
              duration: current ? 1000 : 250,
              fill: 'forwards',
            }).finished;
          }

          if (current) {
            return current.animate([{ opacity: 0 }, { opacity: 1 }], {
              duration: previous ? 1000 : 250,
              fill: 'forwards',
            }).finished;
          }

          return null;
        } catch {
          return null;
        }
      })();

      if (previous instanceof HTMLImageElement) {
        const { src } = previous;
        if (src.length === 0) return;

        URL.revokeObjectURL(src);
      }

      previous?.remove();

      if (!previous && current) animation?.commitStyles();
      animation?.cancel();

      previousRef.current = current;
    };

    const img = background ? new Image() : null;

    if (img && background) {
      img.crossOrigin = 'use-credentials';
      img.src = background;

      img.addEventListener('load', async () => {
        await img.decode?.();

        wrapper.prepend(img);

        fade(img);
      });

      img.addEventListener('error', () => {
        fade(null);
      });
    } else {
      fade(null);
    }

    for (const child of Array.from(wrapper.childNodes)) {
      if (img && child === img) continue;
      if (previous && child === previous) continue;

      if (child instanceof HTMLImageElement) {
        const { src } = child;
        if (src.length === 0) return;

        URL.revokeObjectURL(src);
      }

      child.remove();
    }
  }, [background]);

  return <BackgroundComponent ref={wrapperRef} />;
};
