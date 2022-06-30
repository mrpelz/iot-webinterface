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
} from '../hooks/use-local-storage.js';
import { useLevelShallow, useWebApi } from './web-api.js';
import { useDelay } from '../hooks/use-delay.js';
import { useFlag } from './flags.js';
import { useHookDebug } from '../hooks/use-hook-debug.js';
import { useSegment } from './path.js';
import { useVisibility } from './visibility.js';

export const staticPagesTop = ['global', 'map'] as const;
export const staticPagesBottom = [
  'devices',
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
  home: NavigationElement<HierarchyElementHome>;
  room: NavigationElement<HierarchyElementRoom>;
  staticPage: NavigationElement<StaticPage>;
};

const START_PAGE: StaticPage = 'global';
const STATIC_PAGE_KEY = 'n_staticPage';

const NavigationContext = createContext<TNavigationContext>(
  null as unknown as TNavigationContext
);

const useNavigationElements = <
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
  override?: string | null
) => {
  const elements = useLevelShallow<T>(level, parent);

  const storedName = useGetLocalStorage(persistenceKey);

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

        if (meta.name === storedName) {
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
    [elements, ignorePersistenceInit, override, storedName]
  );

  const result = useState<T | null>(null);
  const [state, setState] = result;

  useEffect(() => {
    setState(() => determineElement(state));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements]);

  useSetLocalStorage(persistenceKey, state?.meta.name || null);

  useEffect(() => {
    if (!override) return;

    setState(() => determineElement(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [override]);

  return result;
};

const useStaticPage = (
  room: HierarchyElementRoom | null,
  override: string | null,
  defer = false
) => {
  const fallback = useDelay(defer ? null : START_PAGE, 300);

  const storedName = useGetLocalStorage(STATIC_PAGE_KEY);

  const determineStaticPage = useCallback(() => {
    if (override) return override as StaticPage;
    if (room) return null;
    if (storedName) return storedName as StaticPage;

    return fallback;
  }, [fallback, override, room, storedName]);

  const result = useState(determineStaticPage);
  const [state, setState] = result;

  useSetLocalStorage(STATIC_PAGE_KEY, state);

  useEffect(() => {
    if (!override) return;

    setState(determineStaticPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [override]);

  useEffect(() => {
    if (!fallback) return;

    setState(determineStaticPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fallback]);

  return result;
};

export const NavigationProvider: FunctionComponent = ({ children }) => {
  useHookDebug('NavigationProvider');

  const isVisible = useVisibility();
  const isVisibleDelayed = useDelay(isVisible, 300);

  const { hierarchy } = useWebApi();
  const settled = useDelay(Boolean(hierarchy), 500);

  const startPageFlag = useFlag('startPage');
  const [startPagePath, setStartPagePath] = useSegment(0);

  const startPagePathInitial = useMemo(
    () => startPagePath || null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const startPagePathActual = useMemo(
    () => (settled ? startPagePath : null),
    [startPagePath, settled]
  );

  const startPageFlagActual = useMemo(
    () => (settled && isVisibleDelayed ? null : startPageFlag),
    [isVisibleDelayed, settled, startPageFlag]
  );

  const startPage = useMemo(
    () => startPageFlagActual || startPagePathActual || startPagePathInitial,
    [startPageFlagActual, startPagePathActual, startPagePathInitial]
  );

  const staticPageFromFlag = useMemo(() => {
    return startPage ? staticPages.includes(startPage as StaticPage) : false;
  }, [startPage]);

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

  const room = useNavigationElements<HierarchyElementRoom>(
    stateBuilding,
    Levels.ROOM,
    'n_room',
    staticPageFromFlag,
    staticPageFromFlag || !startPage ? null : startPage
  );
  const [stateRoom, setRoom] = room;

  const staticPage = useStaticPage(
    stateRoom,
    staticPageFromFlag ? startPage : null,
    !hierarchy
  );
  const [stateStaticPage, setStaticPage] = staticPage;

  useEffect(() => {
    if (!stateStaticPage) return;

    setStartPagePath?.(stateStaticPage);
    setRoom(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateStaticPage]);

  useEffect(() => {
    if (!stateRoom) return;

    setStartPagePath?.(stateRoom.meta.name);
    setStaticPage(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateRoom]);

  const value = useMemo<TNavigationContext>(() => {
    return {
      building,
      home,
      room,
      staticPage,
    };
  }, [building, home, room, staticPage]);

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

export const useNavigationRoom = (): TNavigationContext['room'] => {
  const { room } = useContext(NavigationContext);

  return useMemo(() => room, [room]);
};

export const useNavigationStaticPage = (): TNavigationContext['staticPage'] => {
  const { staticPage } = useContext(NavigationContext);

  return useMemo(() => staticPage, [staticPage]);
};
