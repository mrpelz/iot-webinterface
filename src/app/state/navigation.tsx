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

  const elements = useLevel<T>(level, parent);

  const storedElement = useGetLocalStorage(persistenceKey);

  const determineElement = useCallback(
    (previousState: T | null) => {
      if (previousState) {
        for (const element of elements) {
          const { meta } = element;

          if (meta.name === previousState.meta.name) {
            return element;
          }
        }
      }

      if (ignorePersistenceInit) return null;

      if (override) {
        for (const element of elements) {
          const { meta } = element;

          if (meta.name === override) {
            return element;
          }
        }
      }

      for (const element of elements) {
        const { meta } = element;

        if (meta.name === storedElement) {
          return element;
        }
      }

      if (elements.length === 1) {
        return elements[0];
      }

      for (const element of elements) {
        const { meta } = element;

        if ('isPrimary' in meta && meta.isPrimary) {
          return element;
        }
      }

      return null;
    },
    [elements, ignorePersistenceInit, override, storedElement]
  );

  const element = useState<T | null>(null);
  const [state, setState] = element;

  useEffect(() => {
    setState(() => determineElement(state));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements]);

  useSetLocalStorage(persistenceKey, state?.meta.name || null);

  useEffect(() => {
    if (!override || isVisible) return;

    setState(() => determineElement(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, override]);

  return element;
}

function useStaticPage(
  stateRoom: HierarchyElementRoom | null,
  override: string | null
) {
  const isVisible = useVisibility();

  const storedStaticPage = useGetLocalStorage('n_staticPage');

  const determineStaticPage = useCallback(() => {
    if (override) return override as StaticPage;
    if (stateRoom) return null;
    if (storedStaticPage) return storedStaticPage as StaticPage;

    return START_PAGE;
  }, [override, stateRoom, storedStaticPage]);

  const staticPage = useState(determineStaticPage);
  const [state, setState] = staticPage;

  useSetLocalStorage('n_staticPage', state);

  useEffect(() => {
    if (!override || isVisible) return;

    setState(determineStaticPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [determineStaticPage, isVisible, override]);

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

  const staticPage = useStaticPage(
    stateRoom,
    staticPageFromFlag ? startPage : null
  );
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
