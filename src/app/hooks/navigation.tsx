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
  useRef,
  useState,
} from 'preact/hooks';
import { useFlags } from './flags.js';
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
      elements: HierarchyElementRoom[];
      floor: HierarchyElementFloor;
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
>(allElements: HierarchyElement[] | null, level: T['meta']['level']) {
  const elements = useMemo(() => {
    if (!allElements) return [];

    return getElementsFromLevel<T>(allElements, level);
  }, [allElements, level]);

  const primaryElement = useMemo(() => {
    if (level === Levels.ROOM) return null;

    if (elements.length === 1) {
      return elements[0];
    }

    return (
      elements.find(
        ({ meta }) => (meta as Exclude<T['meta'], MetaRoom>).isPrimary
      ) || null
    );
  }, [elements, level]);

  const [state, setState] = useState(primaryElement);

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
  const preselected = useRef<T>(null);

  const elements = useMemo(() => {
    if (!allElements) return [];

    return getElementsFromLevel<S>(allElements, divisionLevel).map((floor) => {
      const innerElements = getElementsFromLevel<T>(flatten(floor), level);

      for (const innerElement of innerElements) {
        const { meta } = innerElement;

        if (!('name' in meta)) continue;
        if (meta.name !== preselect) continue;

        preselected.current = innerElement;
        break;
      }

      return {
        elements: innerElements,
        floor,
      };
    });
  }, [allElements, divisionLevel, level, preselect]);

  const [state, setState] = useState<T | null>(preselected.current || null);

  return {
    elements,
    setState,
    state,
  };
}

export const NavigationProvider: FunctionComponent = ({ children }) => {
  useHookDebug('NavigationProvider');

  const { hierarchy } = useWebApi();
  const { pageOverride } = useFlags();

  const staticPageFromFlag = pageOverride && staticPages.includes(pageOverride);

  const setMenuVisible = useSetMenuVisible();

  const allElements = useMemo(
    () => (hierarchy ? flatten(hierarchy) : null),
    [hierarchy]
  );

  const home = useNavigationElements<HierarchyElementHome>(
    allElements,
    Levels.HOME
  );
  const building = useNavigationElements<HierarchyElementBuilding>(
    allElements,
    Levels.BUILDING
  );
  const room = useNavigationElementsSubdivided<
    HierarchyElementRoom,
    HierarchyElementFloor
  >(
    allElements,
    Levels.ROOM,
    Levels.FLOOR,
    staticPageFromFlag ? null : pageOverride
  );

  const [state, setState] = useState(() => {
    if (staticPageFromFlag) return pageOverride as StaticPage;
    if (room.state) return null;

    return START_PAGE;
  });

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
