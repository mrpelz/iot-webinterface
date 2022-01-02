import { FunctionComponent, createContext } from 'preact';
import {
  HierarchyElement,
  HierarchyElementBuilding,
  HierarchyElementFloor,
  HierarchyElementHome,
  HierarchyElementRoom,
  Levels,
} from '../web-api.js';
import {
  StateUpdater,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'preact/hooks';
import {
  useGetLocalStorage,
  useSetLocalStorage,
} from '../util/local-storage.js';
import { useLevel, useWebApi } from './web-api.js';
import { useFlag } from './flags.js';
import { useHookDebug } from '../util/hook-debug.js';
import { useSetMenuVisible } from './menu.js';

export const staticPagesTop = ['global', 'map'] as const;
export const staticPagesBottom = [
  'technical',
  'settings',
  'diagnostics',
] as const;

const staticPages: string[] = [...staticPagesTop, ...staticPagesBottom];

export type StaticPage =
  | typeof staticPagesTop[number]
  | typeof staticPagesBottom[number];

type NavigationElement<T> = readonly [T | null, StateUpdater<T | null>];

type TNavigationContext = {
  building: NavigationElement<HierarchyElementBuilding>;
  floor: NavigationElement<HierarchyElementFloor>;
  home: NavigationElement<HierarchyElementHome>;
  room: NavigationElement<HierarchyElementRoom>;
  staticPage: NavigationElement<StaticPage>;
};

const START_PAGE: StaticPage = 'global';

const NavigationContext = createContext<TNavigationContext>(
  null as unknown as TNavigationContext
);

function useNavigationElements<
  T extends
    | HierarchyElementHome
    | HierarchyElementBuilding
    | HierarchyElementFloor
    | HierarchyElementRoom
>(
  parent: HierarchyElement | null,
  level: T['meta']['level'],
  persistenceKey: string
) {
  const [init, setInit] = useState<boolean>(false);

  const elements = useLevel<T>(level, parent);
  const [state, setState] = useState<T | null>(null);

  const preselect = useGetLocalStorage(persistenceKey);
  useSetLocalStorage(persistenceKey, state?.meta.name || null);

  useEffect(() => {
    if (init || !parent) return;
    setInit(true);

    if (elements.length === 1) {
      setState(elements[0]);
      return;
    }

    for (const element of elements) {
      const { meta } = element;

      if (meta.name === preselect) {
        setState(element);
        break;
      }
    }

    for (const element of elements) {
      const { meta } = element;

      if ('isPrimary' in meta && meta.isPrimary) {
        setState(element);
        break;
      }
    }
  }, [elements, init, level, parent, preselect]);

  return [state, setState] as const;
}

export const NavigationProvider: FunctionComponent = ({ children }) => {
  useHookDebug('NavigationProvider');

  const { hierarchy } = useWebApi();
  const pageOverride = useFlag('pageOverride');

  const staticPageFromFlag = pageOverride
    ? staticPages.includes(pageOverride)
    : false;

  const setMenuVisible = useSetMenuVisible();

  const home = useNavigationElements<HierarchyElementHome>(
    hierarchy,
    Levels.HOME,
    'home'
  );
  const [stateHome] = home;

  const building = useNavigationElements<HierarchyElementBuilding>(
    stateHome,
    Levels.BUILDING,
    'building'
  );
  const [stateBuilding] = building;

  const floor = useNavigationElements<HierarchyElementFloor>(
    stateBuilding,
    Levels.FLOOR,
    'floor'
  );
  const [stateFloor] = floor;

  const room = useNavigationElements<HierarchyElementRoom>(
    stateFloor,
    Levels.ROOM,
    'room'
  );
  const [stateRoom, setRoom] = room;

  const storedStaticPage = useGetLocalStorage('staticPage');
  const staticPage = useState(() => {
    if (staticPageFromFlag) return pageOverride as StaticPage;
    if (storedStaticPage) return storedStaticPage as StaticPage;
    if (stateRoom) return null;

    return START_PAGE;
  });
  const [stateStaticPage, setStaticPage] = staticPage;
  useSetLocalStorage('staticPage', stateStaticPage);

  useEffect(() => {
    if (stateStaticPage) {
      setRoom(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateStaticPage]);

  useEffect(() => {
    if (stateRoom) {
      setStaticPage(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateRoom]);

  useEffect(() => {
    setMenuVisible(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateRoom, stateStaticPage]);

  const value = useMemo<TNavigationContext>(() => {
    return {
      building,
      floor,
      home,
      room,
      staticPage,
    };
  }, [building, floor, home, room, staticPage]);

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): TNavigationContext => {
  return useContext(NavigationContext);
};

export const useNavigationBuilding = (): TNavigationContext['building'] => {
  const { building } = useContext(NavigationContext);

  return useMemo(() => building, [building]);
};

export const useNavigationHome = (): TNavigationContext['home'] => {
  const { home } = useContext(NavigationContext);

  return useMemo(() => home, [home]);
};

export const useNavigationFloor = (): TNavigationContext['floor'] => {
  const { floor } = useContext(NavigationContext);

  return useMemo(() => floor, [floor]);
};

export const useNavigationRoom = (): TNavigationContext['room'] => {
  const { room } = useContext(NavigationContext);

  return useMemo(() => room, [room]);
};

export const useNavigationStaticPage = (): TNavigationContext['staticPage'] => {
  const { staticPage } = useContext(NavigationContext);

  return useMemo(() => staticPage, [staticPage]);
};
