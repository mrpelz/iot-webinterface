import {
  IconContainer as IconContainerComponent,
  Title,
  Titlebar as TitlebarComponent,
} from '../components/titlebar.js';
import { MapIcon, MenuIcon, WaitIcon } from '../components/icons.js';
import { useCallback, useLayoutEffect, useMemo, useState } from 'preact/hooks';
import {
  useNavigationRoom,
  useNavigationStaticPage,
} from '../state/navigation.js';
import { FunctionComponent } from 'preact';
import { Translation } from '../state/i18n.js';
import { dimensions } from '../style.js';
import { useBreakpoint } from '../style/breakpoint.js';
import { useFlipMenuVisible } from '../state/menu.js';
import { useMediaQuery } from '../style/main.js';
import { useStreamOnline } from '../state/web-api.js';

export const IconContainer: FunctionComponent<{
  paddingSetter: (input: number) => void;
  right?: true;
}> = ({ children, right, paddingSetter }) => (
  <IconContainerComponent
    ref={(element) => {
      if (!element) return;
      paddingSetter(element.clientWidth);
    }}
    right={right}
  >
    {children}
  </IconContainerComponent>
);

export const Titlebar: FunctionComponent = () => {
  const [padding, setPadding] = useState(0);

  const isDesktop = useBreakpoint(useMediaQuery(dimensions.breakpoint));
  const isStreamOnline = useStreamOnline();

  const [room] = useNavigationRoom();
  const [staticPage, setStaticPage] = useNavigationStaticPage();

  const flipMenuVisible = useFlipMenuVisible();
  const goToMap = useCallback(() => setStaticPage('map'), [setStaticPage]);

  const iconsLeft = useMemo(
    () => [
      ...(isDesktop ? [] : [<MenuIcon onClick={flipMenuVisible} />]),
      ...(isStreamOnline ? [] : [<WaitIcon />]),
    ],
    [flipMenuVisible, isDesktop, isStreamOnline]
  );

  const iconsRight = useMemo(() => {
    return [<MapIcon onClick={goToMap} />];
  }, [goToMap]);

  useLayoutEffect(() => {
    setPadding(0);
  }, [iconsLeft, iconsRight]);

  const paddingSetter = useCallback(
    (input: number) =>
      setPadding((previous) => {
        if (previous > input) return previous;
        return input;
      }),
    []
  );

  return (
    <TitlebarComponent padding={padding}>
      <Title>
        <Translation i18nKey={staticPage || room?.meta.name} />
      </Title>
      {iconsLeft?.length ? (
        <IconContainer paddingSetter={paddingSetter}>{iconsLeft}</IconContainer>
      ) : null}
      {iconsRight?.length ? (
        <IconContainer paddingSetter={paddingSetter} right>
          {iconsRight}
        </IconContainer>
      ) : null}
    </TitlebarComponent>
  );
};
