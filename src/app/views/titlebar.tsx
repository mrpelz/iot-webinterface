import {
  IconContainer as IconContainerComponent,
  Title,
  Titlebar as TitlebarComponent,
} from '../components/titlebar.js';
import { MapIcon, MenuIcon, WaitIcon } from '../components/icons.js';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';
import {
  useNavigationRoom,
  useNavigationStaticPage,
} from '../state/navigation.js';
import { FunctionComponent } from 'preact';
import { Translation } from '../state/i18n.js';
import { dimensions } from '../style.js';
import { useAwaitEvent } from '../util/await-event.js';
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

  const isDesktop = useBreakpoint(useMediaQuery(dimensions.breakpoint));

  const [room] = useNavigationRoom();
  const [staticPage, setStaticPage] = useNavigationStaticPage();

  const flipMenuVisible = useFlipMenuVisible();
  const goToMap = useCallback(() => setStaticPage('map'), [setStaticPage]);

  const iconsLeft = useMemo(
    () => [...(isDesktop ? [] : [<MenuIcon onClick={flipMenuVisible} />])],
    [flipMenuVisible, isDesktop]
  );

  return (
    <TitlebarComponent padding={padding}>
      <Title>
        <Translation i18nKey={staticPage || room?.meta.name} />
      </Title>
      {iconsLeft?.length ? (
        <IconContainer paddingSetter={setPaddingLeft}>
          {iconsLeft}
        </IconContainer>
      ) : null}
      <IconContainer paddingSetter={setPaddingRight} right>
        <WaitIconView />
        <MapIcon onClick={goToMap} />
      </IconContainer>
    </TitlebarComponent>
  );
};
