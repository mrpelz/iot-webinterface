import {
  HierarchyElementFloor,
  HierarchyElementRoom,
  Levels,
  sortByName,
} from '../web-api.js';
import {
  Menu as MenuComponent,
  MenuContent,
  MenuList,
  MenuListItem as MenuListItemComponent,
  MenuSubdivision,
  MenuSubdivisionHeader,
} from '../components/menu.js';
import {
  staticPagesBottom,
  staticPagesTop,
  useNavigationBuilding,
  useNavigationRoom,
  useNavigationStaticPage,
} from '../state/navigation.js';
import { useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';
import { FunctionComponent } from 'preact';
import { Translation } from '../state/i18n.js';
import { rooms } from '../i18n/sorting.js';
import { useArray } from '../util/use-array-compare.js';
import { useIsMenuVisible } from '../state/menu.js';
import { useLevelShallow } from '../state/web-api.js';
import { useTheme } from '../state/theme.js';

const MenuListItem: FunctionComponent<{
  isActive: boolean;
  onClick: () => void;
}> = ({ isActive: active, onClick, children }) => {
  const isMenuVisible = useIsMenuVisible();
  const isHighContrast = useTheme() === 'highContrast';

  const [isHovered, setHovered] = useState(false);

  const ref = useRef<HTMLLIElement>(null);

  useLayoutEffect(() => {
    const { current } = ref;
    if (!active || !current || !isMenuVisible) return;

    current.scrollIntoView({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMenuVisible]);

  return (
    <MenuListItemComponent
      isActive={active}
      isHovered={!isHighContrast && isHovered}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={ref}
    >
      {children}
    </MenuListItemComponent>
  );
};

export const Floor: FunctionComponent<{
  floor: HierarchyElementFloor;
}> = ({ floor }) => {
  const elements = useLevelShallow<HierarchyElementRoom>(Levels.ROOM, floor);
  const sortedElements = useArray(
    useMemo(() => sortByName(elements, rooms), [elements])
  );

  const [selectedRoom, selectRoom] = useNavigationRoom();

  return (
    <>
      <MenuSubdivisionHeader>
        <Translation i18nKey={floor.meta.name} />
      </MenuSubdivisionHeader>
      <MenuList>
        {sortedElements.map((room, key) => (
          <MenuListItem
            key={key}
            isActive={room === selectedRoom}
            onClick={() => selectRoom(room)}
          >
            <Translation i18nKey={room.meta.name} />
          </MenuListItem>
        ))}
      </MenuList>
    </>
  );
};

export const Menu: FunctionComponent = () => {
  const isMenuVisible = useIsMenuVisible();

  const [selectedStaticPage, selectStaticPage] = useNavigationStaticPage();
  const [building] = useNavigationBuilding();

  const floors = useLevelShallow<HierarchyElementFloor>(Levels.FLOOR, building);

  const isVisible = useMemo(
    () => (isMenuVisible === null ? true : isMenuVisible),
    [isMenuVisible]
  );

  return (
    <MenuComponent isVisible={isVisible}>
      <MenuContent>
        <MenuSubdivision>
          <MenuList>
            {staticPagesTop.map((staticPage, key) => (
              <MenuListItem
                key={key}
                isActive={staticPage === selectedStaticPage}
                onClick={() => selectStaticPage(staticPage)}
              >
                <Translation i18nKey={staticPage} />
              </MenuListItem>
            ))}
          </MenuList>
        </MenuSubdivision>

        <MenuSubdivision>
          {floors.map((floor, key) => (
            <Floor key={key} floor={floor} />
          ))}
        </MenuSubdivision>

        <MenuSubdivision>
          <MenuList>
            {staticPagesBottom.map((staticPage, key) => (
              <MenuListItem
                key={key}
                isActive={staticPage === selectedStaticPage}
                onClick={() => selectStaticPage(staticPage)}
              >
                <Translation i18nKey={staticPage} />
              </MenuListItem>
            ))}
          </MenuList>
        </MenuSubdivision>
      </MenuContent>
    </MenuComponent>
  );
};
