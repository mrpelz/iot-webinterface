import { HierarchyElementFloor, HierarchyElementRoom } from '../web-api.js';
import {
  StateUpdater,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';
import { colors, dimensions } from '../style.js';
import {
  staticPagesBottom,
  staticPagesTop,
  useRoom,
  useStaticPage,
} from '../hooks/navigation.js';
import { FunctionComponent } from 'preact';
import { Translation } from '../hooks/i18n.js';
import { dependentValue } from '../style/main.js';
import { forwardRef } from 'preact/compat';
import { rooms } from '../i18n/sorting.js';
import { styled } from 'goober';
import { useIsMenuVisible } from '../hooks/menu.js';

const _Menu = styled('nav')`
  background-color: ${colors.backgroundSecondary()};
  border-inline-end: ${dimensions.hairline} solid ${colors.fontTertiary()};
  height: ${dimensions.appHeight};
  overflow-y: auto;
  overscroll-behavior-y: contain;
  padding: ${dimensions.titlebarHeight} 0;
  scroll-behavior: smooth;
`;

const _MenuContent = styled('ul')`
  display: contents;
`;

const _MenuSubdivision = styled('li')`
  list-style: none;
  margin: 0;
  padding: 0;
  margin-block-end: 1rem;
`;

const _MenuSubdivisionHeader = styled('h2')`
  color: ${colors.fontPrimary()};
  font-size: 0.75rem;
  font-weight: normal;
  margin: 0;
  padding: 0 0.5rem;
  text-transform: uppercase;
`;

const _MenuList = styled('ul')`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const _MenuListItem = styled('li', forwardRef)<{
  isActive: boolean;
  isHovered: boolean;
}>`
  background-color: ${(...args) =>
    dependentValue(
      'isActive',
      colors.selection(),
      dependentValue(
        'isHovered',
        colors.fontTertiary(),
        colors.backgroundPrimary()
      )(...args)
    )(...args)};

  border-block-end: ${dimensions.hairline} solid ${colors.fontTertiary()};
  border-block-start: ${dimensions.hairline} solid ${colors.fontTertiary()};
  color: ${dependentValue(
    'isActive',
    colors.backgroundPrimary(),
    colors.fontPrimary()
  )};
  cursor: pointer;
  margin: 0;
  padding: ${dimensions.fontPadding} 0.75rem;
  font-size: ${dimensions.fontSize};
  height: ${dimensions.titlebarHeight};
  line-height: ${dimensions.fontSize};

  * + & {
    margin-top: -${dimensions.hairline};
  }
`;

const MenuListItem: FunctionComponent<{
  isActive: boolean;
  onClick: () => void;
}> = ({ isActive: active, onClick, children }) => {
  const isMenuVisible = useIsMenuVisible();
  const [isHovered, setHovered] = useState(false);

  const ref = useRef<HTMLLIElement>(null);

  useLayoutEffect(() => {
    const { current } = ref;
    if (!active || !current || !isMenuVisible) return;

    current.scrollIntoView({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMenuVisible]);

  return (
    <_MenuListItem
      isActive={active}
      isHovered={isHovered}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={ref}
    >
      {children}
    </_MenuListItem>
  );
};

export const Floor: FunctionComponent<{
  elements: HierarchyElementRoom[];
  floor: HierarchyElementFloor;
  selectRoom: StateUpdater<HierarchyElementRoom | null>;
  selectedRoom: HierarchyElementRoom | null;
}> = ({ elements, floor, selectRoom, selectedRoom }) => {
  const sortedElements = useMemo(() => {
    const result: HierarchyElementRoom[] = [];

    for (const room of rooms) {
      const match = elements.find(({ meta }) => meta.name === room);
      if (!match) continue;

      result.push(match);
    }

    result.push(
      ...elements.filter(
        ({ meta }) => !rooms.includes(meta.name as typeof rooms[number])
      )
    );

    return result;
  }, [elements]);

  return (
    <>
      <_MenuSubdivisionHeader>
        <Translation i18nKey={floor.meta.name} />
      </_MenuSubdivisionHeader>
      <_MenuList>
        {sortedElements.map((room, key) => (
          <MenuListItem
            key={key}
            isActive={room === selectedRoom}
            onClick={() => selectRoom(room)}
          >
            <Translation i18nKey={room.meta.name} />
          </MenuListItem>
        ))}
      </_MenuList>
    </>
  );
};

export const Menu: FunctionComponent = () => {
  const { setState: selectStaticPage, state: selectedStaticPage } =
    useStaticPage();

  const {
    elements: floors,
    setState: selectRoom,
    state: selectedRoom,
  } = useRoom();

  return (
    <_Menu>
      <_MenuContent>
        <_MenuSubdivision>
          <_MenuList>
            {staticPagesTop.map((staticPage, key) => (
              <MenuListItem
                key={key}
                isActive={staticPage === selectedStaticPage}
                onClick={() => selectStaticPage(staticPage)}
              >
                <Translation i18nKey={staticPage} />
              </MenuListItem>
            ))}
          </_MenuList>
        </_MenuSubdivision>

        <_MenuSubdivision>
          {floors.map(({ children: elements, element: floor }, key) => (
            <Floor
              key={key}
              {...{ elements, floor, selectRoom, selectedRoom }}
            />
          ))}
        </_MenuSubdivision>

        <_MenuSubdivision>
          <_MenuList>
            {staticPagesBottom.map((staticPage, key) => (
              <MenuListItem
                key={key}
                isActive={staticPage === selectedStaticPage}
                onClick={() => selectStaticPage(staticPage)}
              >
                <Translation i18nKey={staticPage} />
              </MenuListItem>
            ))}
          </_MenuList>
        </_MenuSubdivision>
      </_MenuContent>
    </_Menu>
  );
};
