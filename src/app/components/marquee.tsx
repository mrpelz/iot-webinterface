import { styled } from 'goober';
import { FunctionComponent } from 'preact';
import { forwardRef, useEffect, useRef, useState } from 'preact/compat';

const MarqueeWrapper = styled('marquee-wrapper' as 'section', forwardRef)`
  display: block;
  overflow: hidden;
  width: 100%;
`;

const MarqueeContent = styled('marquee-content' as 'section')<{
  duration: number;
}>`
  @keyframes marquee-scroll {
    0% {
      transform: translateX(0);
    }

    100% {
      transform: translateX(-50%);
    }
  }

  display: flex;
  width: max-content;
  animation: marquee-scroll ${({ duration }) => duration}s linear infinite;
  animation-delay: 1s;
`;

const MarqueeTrack = styled('marquee-track' as 'section', forwardRef)<{
  padding?: boolean;
}>`
  display: flex;
  ${({ padding }) => (padding ? 'margin-inline-end: 2ch;' : undefined)}
`;

export const Marquee: FunctionComponent<{
  speed?: number;
}> = ({ children, speed = 0.2 }) => {
  const wrapperRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLElement>(null);

  const [duration, setDuration] = useState(0);
  useEffect(() => {
    const { current: wrapper } = wrapperRef;
    const { current: track } = trackRef;
    if (!wrapper || !track) return;

    if (track.scrollWidth <= wrapper.offsetWidth) {
      return;
    }

    setDuration(track.scrollWidth / wrapper.offsetWidth / speed);
  }, [speed]);

  if (!duration) {
    return (
      <MarqueeWrapper ref={wrapperRef}>
        <MarqueeTrack ref={trackRef}>{children}</MarqueeTrack>
      </MarqueeWrapper>
    );
  }

  return (
    <MarqueeWrapper ref={wrapperRef}>
      <MarqueeContent duration={duration}>
        <MarqueeTrack
          ref={trackRef}
          padding
        >
          {children}
        </MarqueeTrack>
        <MarqueeTrack padding>{children}</MarqueeTrack>
      </MarqueeContent>
    </MarqueeWrapper>
  );
};
