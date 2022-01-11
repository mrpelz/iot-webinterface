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
  useCallback,
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
import { useVisibility } from './visibility.js';

export const staticPagesTop = ['global', 'map'] as const;
export const staticPagesBottom = [
  'technical',
  'settings',
  'diagnostics',
] as const;

export const staticPages = [...staticPagesTop, ...staticPagesBottom];

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
  persistenceKey: string,
  ignorePersistenceInit = false,
  override?: string
) {
  const isVisible = useVisibility();

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

    if (override) {
      for (const element of elements) {
        const { meta } = element;

        if (meta.name === override) {
          setState(element);
          return;
        }
      }
    }

    if (!ignorePersistenceInit) {
      for (const element of elements) {
        const { meta } = element;

        if (meta.name === preselect) {
          setState(element);
          return;
        }
      }
    }

    for (const element of elements) {
      const { meta } = element;

      if ('isPrimary' in meta && meta.isPrimary) {
        setState(element);
        return;
      }
    }
  }, [
    elements,
    ignorePersistenceInit,
    init,
    level,
    override,
    parent,
    preselect,
  ]);

  useEffect(() => {
    if (isVisible) return;

    setInit(false);
  }, [isVisible, override]);

  return [state, setState] as const;
}

function useStaticPage(
  staticPageFromFlag: boolean,
  startPage: string | null,
  stateRoom: HierarchyElementRoom | null
) {
  const isVisible = useVisibility();

  const storedStaticPage = useGetLocalStorage('n_staticPage');

  const determineStaticPage = useCallback(() => {
    if (staticPageFromFlag) return startPage as StaticPage;
    if (storedStaticPage) return storedStaticPage as StaticPage;
    if (stateRoom) return null;

    return START_PAGE;
  }, [startPage, stateRoom, staticPageFromFlag, storedStaticPage]);

  const staticPage = useState(determineStaticPage);
  const [stateStaticPage, setStaticPage] = staticPage;

  useSetLocalStorage('n_staticPage', stateStaticPage);

  useEffect(() => {
    if (!startPage || !staticPageFromFlag || isVisible) return;

    setStaticPage(determineStaticPage);
  }, [
    determineStaticPage,
    isVisible,
    setStaticPage,
    startPage,
    staticPageFromFlag,
  ]);

  return staticPage;
}

export const NavigationProvider: FunctionComponent = ({ children }) => {
  useHookDebug('NavigationProvider');

  const { hierarchy } = useWebApi();
  const startPage = useFlag('startPage');

  const staticPageFromFlag = useMemo(() => {
    return startPage ? staticPages.includes(startPage as StaticPage) : false;
  }, [startPage]);

  const setMenuVisible = useSetMenuVisible();

  const home = useNavigationElements<HierarchyElementHome>(
    hierarchy,
    Levels.HOME,
    'n_home'
  );
  const [stateHome] = home;

  const building = useNavigationElements<HierarchyElementBuilding>(
    stateHome,
    Levels.BUILDING,
    'n_building'
  );
  const [stateBuilding] = building;

  const floor = useNavigationElements<HierarchyElementFloor>(
    stateBuilding,
    Levels.FLOOR,
    'n_floor'
  );
  const [stateFloor] = floor;

  const room = useNavigationElements<HierarchyElementRoom>(
    stateFloor,
    Levels.ROOM,
    'n_room',
    staticPageFromFlag,
    staticPageFromFlag || !startPage ? undefined : startPage
  );
  const [stateRoom, setRoom] = room;

  const staticPage = useStaticPage(staticPageFromFlag, startPage, stateRoom);
  const [stateStaticPage, setStaticPage] = staticPage;

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
