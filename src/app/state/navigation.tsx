/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Level } from '@iot/iot-monolith/tree';
import { createContext, FunctionComponent } from 'preact';
import {
  Dispatch,
  StateUpdater,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'preact/hooks';

import { LevelObject } from '../api.js';
import { useDelay } from '../hooks/use-delay.js';
import { useHookDebug } from '../hooks/use-hook-debug.js';
import {
  useGetLocalStorage,
  useSetLocalStorage,
} from '../hooks/use-local-storage.js';
import { $flags } from '../util/flags.js';
import { useIsInit, useMatch } from './api.js';
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
  | (typeof staticPagesTop)[number]
  | (typeof staticPagesBottom)[number];

type NavigationElement<T> = readonly [
  T | undefined,
  Dispatch<StateUpdater<T | undefined>>,
];

type TNavigationContext = {
  // @ts-ignore
  building: NavigationElement<LevelObject[Level.BUILDING]>;
  home: NavigationElement<LevelObject[Level.HOME]>;
  room: NavigationElement<LevelObject[Level.ROOM]>;
  staticPage: NavigationElement<StaticPage>;
};

const START_PAGE: StaticPage = 'global';
const STATIC_PAGE_KEY = 'n_staticPage';

const NavigationContext = createContext<TNavigationContext>(
  null as unknown as TNavigationContext,
);

const useNavigationElements = <
  T extends Level.HOME | Level.BUILDING | Level.FLOOR | Level.ROOM,
>(
  parent: object | undefined,
  level: T,
  persistenceKey: string,
  ignorePersistenceInit = false,
  override?: string | null,
) => {
  type CompoundMatch = LevelObject[T];

  // @ts-ignore
  const objects = useMatch({ level }, parent) as CompoundMatch[];

  const storedName = useGetLocalStorage(persistenceKey);

  const determineElement = useCallback(
    (previousState: CompoundMatch | undefined) => {
      if (previousState) {
        for (const object of objects) {
          if (object.$ === previousState.$) {
            return object;
          }
        }
      }

      if (ignorePersistenceInit) return undefined;

      if (override) {
        for (const object of objects) {
          if (object.$ === override) {
            return object;
          }
        }
      }

      for (const object of objects) {
        if (object.$ === storedName) {
          return object;
        }
      }

      if (objects.length === 1) {
        return objects[0];
      }

      return undefined;
    },
    [objects, ignorePersistenceInit, override, storedName],
  );

  const result = useState<CompoundMatch | undefined>(undefined);
  const [state, setState] = result;

  useEffect(() => {
    setState(() => determineElement(state));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objects]);

  // @ts-ignore
  useSetLocalStorage(persistenceKey, state?.$);

  useEffect(() => {
    if (!override) return;

    setState(() => determineElement(undefined));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [override]);

  return result;
};

// @ts-ignore
const useStaticPage = (
  room: LevelObject[Level.ROOM] | undefined,
  override?: string,
  defer = false,
) => {
  const fallback = useDelay(defer ? undefined : START_PAGE, 300);

  const storedName = useGetLocalStorage(STATIC_PAGE_KEY);

  const determineStaticPage = useCallback(() => {
    if (override) return override as StaticPage;
    if (room) return undefined;
    if (storedName) return storedName as StaticPage;

    return fallback;
    // @ts-ignore
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

  const settled = useDelay(useIsInit(), 500);

  const startPageFlag = $flags.startPage.value;
  const [startPagePath, setStartPagePath] = useSegment(0);

  const startPagePathInitial = useMemo(
    () => startPagePath || undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const startPage = useMemo(
    () =>
      (settled && isVisibleDelayed ? undefined : startPageFlag) ||
      (settled ? startPagePath : undefined) ||
      startPagePathInitial,
    [
      isVisibleDelayed,
      settled,
      startPageFlag,
      startPagePath,
      startPagePathInitial,
    ],
  );

  const staticPageFromFlag = useMemo(
    () => (startPage ? staticPages.includes(startPage as StaticPage) : false),
    [startPage],
  );

  // @ts-ignore
  const home = useNavigationElements(undefined, Level.HOME, 'n_home');
  const [stateHome] = home;

  const building = useNavigationElements(
    stateHome,
    Level.BUILDING,
    'n_building',
  );
  const [stateBuilding] = building;

  const room = useNavigationElements(
    stateBuilding,
    Level.ROOM,
    'n_room',
    staticPageFromFlag,
    staticPageFromFlag || !startPage ? null : startPage,
  );
  const [stateRoom, setRoom] = room;

  const staticPage = useStaticPage(
    stateRoom,
    staticPageFromFlag ? startPage : undefined,
    !useIsInit(),
  );
  const [stateStaticPage, setStaticPage] = staticPage;

  useEffect(() => {
    if (!stateStaticPage) return;

    setStartPagePath?.(stateStaticPage);
    setRoom(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateStaticPage]);

  useEffect(() => {
    if (!stateRoom) return;

    setStartPagePath?.(stateRoom.$);
    setStaticPage(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateRoom]);

  const value = useMemo<TNavigationContext>(
    () => ({
      building,
      home,
      room,
      staticPage,
    }),
    [building, home, room, staticPage],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): TNavigationContext =>
  useContext(NavigationContext);

export const useNavigationBuilding = (): TNavigationContext['building'] => {
  const { building } = useContext(NavigationContext);

  return useMemo(() => building, [building]);
};

export const useNavigationHome = (): TNavigationContext['home'] => {
  const { home } = useContext(NavigationContext);

  return useMemo(() => home, [home]);
};

// @ts-ignore
export const useNavigationRoom = (): TNavigationContext['room'] => {
  const { room } = useContext(NavigationContext);

  return useMemo(() => room, [room]);
};

export const useNavigationStaticPage = (): TNavigationContext['staticPage'] => {
  const { staticPage } = useContext(NavigationContext);

  return useMemo(() => staticPage, [staticPage]);
};
