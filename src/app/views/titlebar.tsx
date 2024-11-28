import { FunctionComponent, JSX } from 'preact';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';

import { api } from '../api.js';
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
import { useAwaitEvent } from '../hooks/use-await-event.js';
import { flipMenuVisible } from '../state/menu.js';
import {
  $isRoot,
  $rootPath,
  $setRootPath,
  goPrevious,
  goUp,
} from '../state/path.js';
import { useCapitalizedTitle } from '../state/title.js';
import { dimensions } from '../style.js';
import { useBreakpoint } from '../style/breakpoint.js';
import { getMediaQuery } from '../style/main.js';
import { getSignal } from '../util/signal.js';

const $isWebSocketOnline = api.$isWebSocketOnline();

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
  const isWebSocketOnline = getSignal($isWebSocketOnline);

  const [isWebSocketOnlineDelayed, handleEvent] = useAwaitEvent(
    isWebSocketOnline,
    true,
  );

  const onAnimationIteration = useCallback<
    JSX.AnimationEventHandler<SVGSVGElement>
  >(
    ({ animationName }) => {
      if (animationName !== 'wait-circle-animation') return;

      handleEvent();
    },
    [handleEvent],
  );

  if (isWebSocketOnlineDelayed) return null;

  return <WaitIcon onAnimationIteration={onAnimationIteration} />;
};

export const Titlebar: FunctionComponent = () => {
  const [paddingLeft, setPaddingLeft] = useState(0);
  const [paddingRight, setPaddingRight] = useState(0);

  const padding = useMemo(
    () => Math.max(paddingLeft, paddingRight),
    [paddingLeft, paddingRight],
  );

  const title = useCapitalizedTitle();

  const isDesktop = useBreakpoint(getMediaQuery(dimensions.breakpointDesktop));

  const rootPath = getSignal($rootPath);
  const setRootPath = getSignal($setRootPath);

  const isMap = useMemo(() => rootPath === 'map', [rootPath]);
  const isRoot = getSignal($isRoot);

  const leftIcon = useMemo(() => {
    if (!isRoot) {
      return <BackIcon onClick={goUp} />;
    }

    if (isDesktop) return null;

    return <MenuIcon onClick={flipMenuVisible} />;
  }, [isDesktop, isRoot]);

  const rightIcon = useMemo(() => {
    if (!isRoot) {
      return <MenuIcon onClick={flipMenuVisible} />;
    }

    if (isMap) {
      return <ReturnIcon onClick={() => goPrevious()} />;
    }

    return <MapIcon onClick={() => setRootPath('map')} />;
  }, [isMap, isRoot, setRootPath]);

  return (
    <TitlebarComponent padding={padding}>
      {title ? <Title>{title}</Title> : null}
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
