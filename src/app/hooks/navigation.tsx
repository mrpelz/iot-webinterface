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
import { useSetMenuVisible } from './menu.js';
import { useWebApi } from './web-api.js';

export const staticPagesTop = ['global', 'map'] as const;
export const staticPagesBottom = [
  'technical',
  'settings',
  'diagnostics',
] as const;

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
  divisionLevel: S['meta']['level']
) {
  const elements = useMemo(() => {
    if (!allElements) return [];

    return getElementsFromLevel<S>(allElements, divisionLevel).map((floor) => ({
      elements: getElementsFromLevel<T>(flatten(floor), level),
      floor,
    }));
  }, [allElements, divisionLevel, level]);

  const [state, setState] = useState<HierarchyElementRoom | null>(null);

  return {
    elements,
    setState,
    state,
  };
}

export const NavigationProvider: FunctionComponent = ({ children }) => {
  const { hierarchy } = useWebApi();

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
  >(allElements, Levels.ROOM, Levels.FLOOR);

  const [state, setState] = useState<StaticPage | null>(START_PAGE);
  const staticPage = { setState, state };

  const value: TNavigationContext = {
    building,
    home,
    room,
    staticPage,
  };

  useEffect(() => {
    if (value.staticPage.state) {
      value.room.setState(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.staticPage.state]);

  useEffect(() => {
    if (value.room.state) {
      value.staticPage.setState(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.room.state]);

  useEffect(() => {
    setMenuVisible(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.room.state, value.staticPage.state]);

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export function useNavigation(): TNavigationContext {
  return useContext(NavigationContext);
}

export function useBuilding(): TNavigationContext['building'] {
  return useNavigation().building;
}

export function useHome(): TNavigationContext['home'] {
  return useNavigation().home;
}

export function useRoom(): TNavigationContext['room'] {
  return useNavigation().room;
}

export function useStaticPage(): TNavigationContext['staticPage'] {
  return useNavigation().staticPage;
}
