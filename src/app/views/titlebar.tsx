import {
  BackIcon,
  MapIcon,
  MenuIcon,
  ReturnIcon,
  WaitIcon,
} from '../components/icons.js';
import {
  IconContainer as IconContainerComponent,
  Title,
  Titlebar as TitlebarComponent,
} from '../components/titlebar.js';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';
import { useGoPreviousSegment, useGoUp, useSegment } from '../state/path.js';
import { Capitalize } from '../components/text.js';
import { FunctionComponent } from 'preact';
import { dimensions } from '../style.js';
import { useAwaitEvent } from '../util/use-await-event.js';
import { useBreakpoint } from '../style/breakpoint.js';
import { useFlipMenuVisible } from '../state/menu.js';
import { useMediaQuery } from '../style/main.js';
import { useStreamOnline } from '../state/web-api.js';
import { useTitle } from '../state/title.js';

export const IconContainer: FunctionComponent<{
  paddingSetter: (input: number) => void;
  right?: true;
}> = ({ children, right, paddingSetter }) => {
  const ref = useRef<HTMLDivElement>(null);

  const observerCallback = useCallback(() => {
    if (!ref.current) return;

    paddingSetter(ref.current.clientWidth);
  }, [paddingSetter, ref]);

  const observerRef = useRef(new MutationObserver(observerCallback));

  useEffect(() => {
    const observer = observerRef.current;

    if (ref.current) {
      observer.observe(ref.current, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, [ref]);

  return (
    <IconContainerComponent ref={ref} right={right}>
      {children}
    </IconContainerComponent>
  );
};

const WaitIconView: FunctionComponent = () => {
  const isStreamOnline = useStreamOnline();

  const [isStreamOnlineDelayed, handleEvent] = useAwaitEvent(
    isStreamOnline,
    true
  );

  const onAnimationIteration = useCallback<
    JSX.AnimationEventHandler<SVGSVGElement>
  >(
    ({ animationName }) => {
      if (animationName !== 'wait-circle-animation') return;

      handleEvent();
    },
    [handleEvent]
  );

  if (isStreamOnlineDelayed) return null;

  return <WaitIcon onAnimationIteration={onAnimationIteration} />;
};

export const Titlebar: FunctionComponent = () => {
  const [paddingLeft, setPaddingLeft] = useState(0);
  const [paddingRight, setPaddingRight] = useState(0);

  const padding = useMemo(
    () => Math.max(paddingLeft, paddingRight),
    [paddingLeft, paddingRight]
  );

  const title = useTitle();

  const isDesktop = useBreakpoint(useMediaQuery(dimensions.breakpointDesktop));

  const flipMenuVisible = useFlipMenuVisible();

  const goUp = useGoUp();

  const [page, setPage] = useSegment(0);
  const isMap = useMemo(() => page === 'map', [page]);

  const goPrevious = useGoPreviousSegment(0);

  const leftIcon = useMemo(() => {
    if (goUp) {
      return <BackIcon onClick={goUp} />;
    }

    if (isDesktop) return null;

    return <MenuIcon onClick={flipMenuVisible} />;
  }, [flipMenuVisible, goUp, isDesktop]);

  const rightIcon = useMemo(() => {
    if (goUp) {
      return <MenuIcon onClick={flipMenuVisible} />;
    }

    if (isMap) {
      return goPrevious ? <ReturnIcon onClick={() => goPrevious()} /> : null;
    }

    return setPage ? <MapIcon onClick={() => setPage('map')} /> : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goPrevious, goUp, isMap, setPage]);

  return (
    <TitlebarComponent padding={padding}>
      {title ? (
        <Title>
          <Capitalize>{title}</Capitalize>
        </Title>
      ) : null}
      {leftIcon ? (
        <IconContainer paddingSetter={setPaddingLeft}>{leftIcon}</IconContainer>
      ) : null}
      <IconContainer paddingSetter={setPaddingRight} right>
        <WaitIconView />
        {rightIcon}
      </IconContainer>
    </TitlebarComponent>
  );
};
