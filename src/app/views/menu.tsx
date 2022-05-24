import {
  HierarchyElementFloor,
  HierarchyElementRoom,
  Levels,
  sortBy,
} from '../web-api.js';
import {
  Menu as MenuComponent,
  MenuContent,
  MenuIndicatorItem,
  MenuIndicatorSection,
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
import { useChild, useChildGetter, useLevelShallow } from '../state/web-api.js';
import { useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';
import { FunctionComponent } from 'preact';
import { Translation } from '../state/i18n.js';
import { colors } from '../style.js';
import { roomSorting } from '../i18n/mapping.js';
import { useArray } from '../util/use-array-compare.js';
import { useGoRoot } from '../state/path.js';
import { useIsMenuVisible } from '../state/menu.js';
import { useTheme } from '../state/theme.js';

const AllLightState: FunctionComponent<{ room: HierarchyElementRoom }> = ({
  room,
}) => {
  const allLights = useChildGetter<boolean>(room, 'allLights');

  return allLights ? <MenuIndicatorItem color="hsl(40, 100%, 50%)" /> : null;
};

const AllWindowsState: FunctionComponent<{ room: HierarchyElementRoom }> = ({
  room,
}) => {
  const allWindows = useChildGetter<boolean>(room, 'allWindows');

  return allWindows ? <MenuIndicatorItem color="hsl(0, 100%, 50%)" /> : null;
};

const DoorState: FunctionComponent<{ room: HierarchyElementRoom }> = ({
  room,
}) => {
  const fontColor = colors.fontPrimary()();
  const door = useChild(room, 'door');
  const open = useChildGetter<boolean>(door, 'open');

  return open ? <MenuIndicatorItem color={fontColor} /> : null;
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
    useMemo(() => sortBy(elements, 'name', roomSorting).all, [elements])
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
              <MenuIndicatorSection>
                <AllWindowsState room={room} />
                <DoorState room={room} />
                <AllLightState room={room} />
              </MenuIndicatorSection>
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
