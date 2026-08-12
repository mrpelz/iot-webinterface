import { Icon, Link, Navbar } from 'konsta/react';
import {
  AnimationEventHandler,
  FunctionComponent,
  TargetedAnimationEvent,
} from 'preact';
import { useCallback, useMemo } from 'preact/hooks';

import {
  BackIcon,
  MapIcon,
  MenuIcon,
  ReturnIcon,
  WaitIcon,
} from '../components/icons.js';
import { useIsWebSocketOnline } from '../hooks/use-api.js';
import { useAwaitEvent } from '../hooks/use-await-event.js';
import { flipMenuVisible } from '../state/menu.js';
import {
  goPrevious,
  goUp,
  isRoot$,
  rootPath$,
  setRootPath,
} from '../state/path.js';
import { capitalizedTitle$ } from '../state/title.js';
import { dimensions } from '../style.js';
import { useBreakpoint } from '../style/breakpoint.js';
import { getMediaQuery } from '../style/main.js';

const WaitIconView: FunctionComponent = () => {
  const { value: isWebSocketOnline } = useIsWebSocketOnline();

  const [isWebSocketOnlineDelayed, handleEvent] = useAwaitEvent(
    isWebSocketOnline,
    true,
  );

  const onAnimationIteration = useCallback<
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    AnimationEventHandler<SVGSVGElement> & Function
  >(
    ({ animationName }: TargetedAnimationEvent<SVGSVGElement>) => {
      if (animationName !== 'wait-circle-animation') return;

      handleEvent();
    },
    [handleEvent],
  );

  if (isWebSocketOnlineDelayed) return null;

  return <WaitIcon onAnimationIteration={onAnimationIteration} />;
};

export const Titlebar: FunctionComponent = () => {
  const { value: title } = capitalizedTitle$;

  const isDesktop = useBreakpoint(getMediaQuery(dimensions.breakpointDesktop));

  const rootPath = rootPath$.value;

  const isMap = useMemo(() => rootPath === 'map', [rootPath]);
  const isRoot = isRoot$.value;

  const [leftIcon, onLeftIconClick] = useMemo(() => {
    if (!isRoot) {
      return [<BackIcon key={0} />, goUp] as const;
    }

    if (isDesktop) return [null, null] as const;

    return [<MenuIcon key={0} />, flipMenuVisible] as const;
  }, [isDesktop, isRoot]);

  // eslint-disable-next-line new-cap, unicorn/no-invalid-argument-count
  const waitIcon = WaitIconView({});

  const [rightIcon, onRightIconClick] = useMemo(() => {
    if (!isDesktop && !isRoot) {
      return [<MenuIcon key={0} />, flipMenuVisible] as const;
    }

    if (isMap) {
      return [<ReturnIcon key={0} />, () => goPrevious()] as const;
    }

    return [<MapIcon key={0} />, () => setRootPath('map')] as const;
  }, [isDesktop, isMap, isRoot]);

  return (
    <Navbar
      large
      title={title}
      left={
        leftIcon ? (
          <Link
            iconOnly
            onClick={onLeftIconClick}
          >
            <Icon
              className="w-5 h-5"
              ios={leftIcon}
              material={leftIcon}
            />
          </Link>
        ) : null
      }
      right={
        <>
          {waitIcon ? (
            <Link iconOnly>
              <Icon
                className="w-5 h-5"
                ios={waitIcon}
                material={waitIcon}
              />
            </Link>
          ) : null}
          <Link
            iconOnly
            onClick={onRightIconClick}
          >
            <Icon
              className="w-5 h-5"
              ios={rightIcon}
              material={rightIcon}
            />
          </Link>
        </>
      }
    />
  );
};
