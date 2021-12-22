import { FunctionComponent, createContext } from 'preact';
import {
  HierarchyElement,
  HierarchyElementBuilding,
  HierarchyElementFloor,
  HierarchyElementHome,
  HierarchyElementRoom,
  HierarchyElementWithMeta,
  Levels,
  MetaRoom,
  flatten,
  getElementsFromLevel,
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
import { useFlag } from './flags.js';
import { useHookDebug } from '../util/hook-debug.js';
import { useSetMenuVisible } from './menu.js';
import { useWebApi } from './web-api.js';

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

type NavigationElement<T, E = T> = {
  elements: E[];
  setState: StateUpdater<T | null>;
  state: T | null;
};

type TNavigationContext = {
  building: NavigationElement<HierarchyElementBuilding>;
  home: NavigationElement<HierarchyElementHome>;
  room: NavigationElement<
    HierarchyElementRoom,
    {
      children: HierarchyElementRoom[];
      element: HierarchyElementFloor;
    }
  >;
  staticPage: {
    setState: StateUpdater<StaticPage | null>;
    state: StaticPage | null;
  };
};

const START_PAGE: StaticPage = 'global';

const NavigationContext = createContext<TNavigationContext>(
  null as unknown as TNavigationContext
);

function useNavigationElements<
  T extends
    | HierarchyElementBuilding
    | HierarchyElementHome
    | HierarchyElementRoom
>(
  allElements: HierarchyElement[] | null,
  level: T['meta']['level'],
  preselect: string | null = null
) {
  const [state, setState] = useState<T | null>(null);

  const elements = useMemo(() => {
    if (!allElements) return [];

    return getElementsFromLevel<T>(allElements, level);
  }, [allElements, level]);

  useEffect(() => {
    if (level === Levels.ROOM) return;

    if (elements.length === 1) {
      setState(elements[0]);
      return;
    }

    for (const element of elements) {
      const { isPrimary, name } = element.meta as Exclude<T['meta'], MetaRoom>;

      if (name === preselect || isPrimary) {
        setState(element);
        break;
      }
    }
  }, [elements, level, preselect]);

  return {
    elements,
    setState,
    state,
  };
}

function useNavigationElementsSubdivided<
  T extends HierarchyElementWithMeta,
  S extends HierarchyElementWithMeta
>(
  allElements: HierarchyElement[] | null,
  level: T['meta']['level'],
  divisionLevel: S['meta']['level'],
  preselect: string | null = null
) {
  const [state, setState] = useState<T | null>(null);

  const elements = useMemo(() => {
    if (!allElements) return [];

    return getElementsFromLevel<S>(allElements, divisionLevel).map(
      (outerElement) => {
        const innerElements = getElementsFromLevel<T>(
          flatten(outerElement),
          level
        );

        for (const innerElement of innerElements) {
          const { meta } = innerElement;

          if (!('name' in meta)) continue;
          if (meta.name !== preselect) continue;

          setState(innerElement);
          break;
        }

        return {
          children: innerElements,
          element: outerElement,
        };
      }
    );
  }, [allElements, divisionLevel, level, preselect]);

  return {
    elements,
    setState,
    state,
  };
}

export const NavigationProvider: FunctionComponent = ({ children }) => {
  useHookDebug('NavigationProvider');

  const { hierarchy } = useWebApi();
  const pageOverride = useFlag('pageOverride');

  const staticPageFromFlag = pageOverride && staticPages.includes(pageOverride);

  const setMenuVisible = useSetMenuVisible();

  const home = useNavigationElements<HierarchyElementHome>(
    useMemo(() => {
      if (!hierarchy) return null;
      return flatten(hierarchy);
    }, [hierarchy]),
    Levels.HOME,
    useGetLocalStorage('home')
  );
  useSetLocalStorage('home', home.state?.meta.name || null);

  const building = useNavigationElements<HierarchyElementBuilding>(
    useMemo(() => {
      if (!home.state?.children) return null;
      return Object.values(home.state.children);
    }, [home.state]),
    Levels.BUILDING,
    useGetLocalStorage('building')
  );
  useSetLocalStorage('building', building.state?.meta.name || null);

  const storedRoom = useGetLocalStorage('room');
  const room = useNavigationElementsSubdivided<
    HierarchyElementRoom,
    HierarchyElementFloor
  >(
    useMemo(() => {
      if (!building.state?.children) return null;
      return Object.values(building.state.children);
    }, [building.state]),
    Levels.ROOM,
    Levels.FLOOR,
    staticPageFromFlag ? null : storedRoom || pageOverride
  );
  useSetLocalStorage('room', room.state?.meta.name || null);

  const storedStaticPage = useGetLocalStorage('staticPage');
  const [state, setState] = useState(() => {
    if (staticPageFromFlag) return pageOverride as StaticPage;
    if (storedStaticPage) return storedStaticPage as StaticPage;
    if (room.state) return null;

    return START_PAGE;
  });
  useSetLocalStorage('staticPage', state);

  const staticPage = useMemo(() => ({ setState, state }), [state]);

  useEffect(() => {
    if (staticPage.state) {
      room.setState(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staticPage.state]);

  useEffect(() => {
    if (room.state) {
      staticPage.setState(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.state]);

  useEffect(() => {
    setMenuVisible(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.state, staticPage.state]);

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

export const useBuilding = (): TNavigationContext['building'] => {
  const { building } = useContext(NavigationContext);

  return useMemo(() => building, [building]);
};

export const useHome = (): TNavigationContext['home'] => {
  const { home } = useContext(NavigationContext);

  return useMemo(() => home, [home]);
};

export const useRoom = (): TNavigationContext['room'] => {
  const { room } = useContext(NavigationContext);

  return useMemo(() => room, [room]);
};

export const useStaticPage = (): TNavigationContext['staticPage'] => {
  const { staticPage } = useContext(NavigationContext);

  return useMemo(() => staticPage, [staticPage]);
};
