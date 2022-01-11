import { FunctionComponent, createContext } from 'preact';
import {
  IconContainer as IconContainerComponent,
  Title,
  Titlebar as TitlebarComponent,
} from '../components/titlebar.js';
import { MapIcon, MenuIcon } from '../components/icons.js';
import {
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';
import {
  useNavigationRoom,
  useNavigationStaticPage,
} from '../hooks/navigation.js';
import { Translation } from '../hooks/i18n.js';
import { dimensions } from '../style.js';
import { useBreakpoint } from '../style/breakpoint.js';
import { useFlipMenuVisible } from '../hooks/menu.js';
import { useMediaQuery } from '../style/main.js';

const ProgrammaticPaddingContext = createContext(
  null as unknown as (padding: number) => void
);

export const IconContainer: FunctionComponent<{ right?: true }> = ({
  children,
  right,
}) => {
  const setPadding = useContext(ProgrammaticPaddingContext);

  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;

    setPadding(ref.current.clientWidth);
  }, [ref, setPadding]);

  return (
    <IconContainerComponent ref={ref} right={right}>
      {children}
    </IconContainerComponent>
  );
};

export const Titlebar: FunctionComponent = () => {
  const [padding, setPadding] = useState(0);

  const [room] = useNavigationRoom();
  const [staticPage, setStaticPage] = useNavigationStaticPage();

  const isDesktop = useBreakpoint(useMediaQuery(dimensions.breakpoint));
  const flipMenuVisible = useFlipMenuVisible();

  const iconsLeft = useMemo(() => {
    return isDesktop ? [] : [<MenuIcon onClick={flipMenuVisible} />];
  }, [flipMenuVisible, isDesktop]);

  const iconsRight = useMemo(() => {
    return [<MapIcon onClick={() => setStaticPage('map')} />];
  }, [setStaticPage]);

  useLayoutEffect(() => {
    setPadding(0);
  }, [iconsLeft, iconsRight]);

  return (
    <TitlebarComponent padding={padding}>
      <Title>
        <Translation i18nKey={staticPage || room?.meta.name} />
      </Title>
      <ProgrammaticPaddingContext.Provider
        value={(number) =>
          setPadding((previous) => {
            if (previous > number) return previous;
            return number;
          })
        }
      >
        {iconsLeft?.length ? <IconContainer>{iconsLeft}</IconContainer> : null}
        {iconsRight?.length ? (
          <IconContainer right>{iconsRight}</IconContainer>
        ) : null}
      </ProgrammaticPaddingContext.Provider>
    </TitlebarComponent>
  );
};
