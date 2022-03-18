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
import {
  useNavigationRoom,
  useNavigationStaticPage,
} from '../state/navigation.js';
import { FunctionComponent } from 'preact';
import { Translation } from '../state/i18n.js';
import { dimensions } from '../style.js';
import { useAwaitEvent } from '../util/use-await-event.js';
import { useBreakpoint } from '../style/breakpoint.js';
import { useFlipMenuVisible } from '../state/menu.js';
import { useMediaQuery } from '../style/main.js';
import { useStreamOnline } from '../state/web-api.js';

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

  const isDesktop = useBreakpoint(useMediaQuery(dimensions.breakpointDesktop));

  const flipMenuVisible = useFlipMenuVisible();

  const goUp = useGoUp();

  const [page, setPage] = useSegment(0);
  const isMap = useMemo(() => page === 'map', [page]);

  const goPrevious = useGoPreviousSegment(0);

  const [room] = useNavigationRoom();
  const [staticPage] = useNavigationStaticPage();

  const upIcon = useMemo(
    () => (goUp ? <BackIcon onClick={goUp} /> : null),
    [goUp]
  );

  const switchIcon = useMemo(() => {
    if (isMap) {
      return goPrevious ? <ReturnIcon onClick={() => goPrevious()} /> : null;
    }

    return setPage ? <MapIcon onClick={() => setPage('map')} /> : null;
  }, [goPrevious, isMap, setPage]);

  const menuIcon = useMemo(
    () => (isDesktop ? null : <MenuIcon onClick={flipMenuVisible} />),
    [flipMenuVisible, isDesktop]
  );

  return (
    <TitlebarComponent padding={padding}>
      <Title>
        <Translation i18nKey={staticPage || room?.meta.name} />
      </Title>
      {menuIcon || upIcon ? (
        <IconContainer paddingSetter={setPaddingLeft}>
          {upIcon}
          {menuIcon}
        </IconContainer>
      ) : null}
      <IconContainer paddingSetter={setPaddingRight} right>
        <WaitIconView />
        {switchIcon}
      </IconContainer>
    </TitlebarComponent>
  );
};
