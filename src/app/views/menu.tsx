import {
  HierarchyElementFloor,
  HierarchyElementRoom,
  Levels,
  sortBy,
} from '../web-api.js';
import {
  Menu as MenuComponent,
  MenuContent,
  MenuIndicator,
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
import { useChildGetter, useLevelShallow } from '../state/web-api.js';
import { useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';
import { FunctionComponent } from 'preact';
import { Translation } from '../state/i18n.js';
import { rooms } from '../i18n/sorting.js';
import { useArray } from '../util/use-array-compare.js';
import { useGoRoot } from '../state/path.js';
import { useIsMenuVisible } from '../state/menu.js';
import { useTheme } from '../state/theme.js';

const AllLightState: FunctionComponent<{ room: HierarchyElementRoom }> = ({
  room,
}) => {
  const allLights = useChildGetter<boolean>(room, 'allLights');

  return allLights ? <MenuIndicator /> : null;
};

const MenuListItem: FunctionComponent<{
  isActive: boolean;
  onClick: () => void;
}> = ({ isActive: active, onClick, children }) => {
  const isMenuVisible = useIsMenuVisible();
  const isHighContrast = useTheme() === 'highContrast';

  const [isHovered, setHovered] = useState(false);

  const ref = useRef<HTMLLIElement>(null);

  useLayoutEffect(() => {
    if (isMenuVisible) return;
    setHovered(false);
  }, [isMenuVisible]);

  useLayoutEffect(() => {
    const { current } = ref;
    if (!active || !current || !isMenuVisible) return;

    current.scrollIntoView({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMenuVisible]);

  return (
    <MenuListItemComponent
      isActive={active}
      isHighContrast={isHighContrast}
      isHovered={isHovered}
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
  const goRoot = useGoRoot();

  const elements = useLevelShallow<HierarchyElementRoom>(Levels.ROOM, floor);
  const sortedElements = useArray(
    useMemo(() => sortBy(elements, 'name', rooms).all, [elements])
  );

  const [selectedRoom, selectRoom] = useNavigationRoom();

  return (
    <>
      <MenuSubdivisionHeader>
        <Translation i18nKey={floor.meta.name} />
      </MenuSubdivisionHeader>
      <MenuList>
        {sortedElements.map((room, key) => {
          const isActive = room === selectedRoom;

          return (
            <MenuListItem
              key={key}
              isActive={isActive}
              onClick={() => (isActive ? goRoot?.() : selectRoom(room))}
            >
              <Translation i18nKey={room.meta.name} />
              <AllLightState room={room} />
            </MenuListItem>
          );
        })}
      </MenuList>
    </>
  );
};

export const Menu: FunctionComponent = () => {
  const goRoot = useGoRoot();

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
            {staticPagesTop.map((staticPage, key) => {
              const isActive = staticPage === selectedStaticPage;

              return (
                <MenuListItem
                  key={key}
                  isActive={isActive}
                  onClick={() => {
                    return isActive ? goRoot?.() : selectStaticPage(staticPage);
                  }}
                >
                  <Translation i18nKey={staticPage} />
                </MenuListItem>
              );
            })}
          </MenuList>
        </MenuSubdivision>

        <MenuSubdivision>
          {floors.map((floor, key) => (
            <Floor key={key} floor={floor} />
          ))}
        </MenuSubdivision>

        <MenuSubdivision>
          <MenuList>
            {staticPagesBottom.map((staticPage, key) => {
              const isActive = staticPage === selectedStaticPage;

              return (
                <MenuListItem
                  key={key}
                  isActive={isActive}
                  onClick={() => {
                    return isActive ? goRoot?.() : selectStaticPage(staticPage);
                  }}
                >
                  <Translation i18nKey={staticPage} />
                </MenuListItem>
              );
            })}
          </MenuList>
        </MenuSubdivision>
      </MenuContent>
    </MenuComponent>
  );
};
