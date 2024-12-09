/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Level, levelObjectMatch } from '@iot/iot-monolith/tree';
import { FunctionComponent } from 'preact';
import { useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';

import { LevelObject, sortBy } from '../api.js';
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
import { useArray } from '../hooks/use-array-compare.js';
import { roomSorting } from '../i18n/mapping.js';
import { useMatch, useTypedEmitter } from '../state/api.js';
import { Translation } from '../state/i18n.js';
import { useIsMenuVisible } from '../state/menu.js';
import {
  staticPagesBottom,
  staticPagesTop,
  useNavigationBuilding,
  useNavigationRoom,
  useNavigationStaticPage,
} from '../state/navigation.js';
import { useGoRoot } from '../state/path.js';
import { useFlipScreensaverActive } from '../state/screensaver.js';
import { useTheme } from '../state/theme.js';
import { colors } from '../style.js';
import { $flags } from '../util/flags.js';

// @ts-ignore
const AllLightState: FunctionComponent<{ room: LevelObject[Level.ROOM] }> = ({
  room,
}) => {
  const allLights = 'allLights' in room ? room.allLights.main : undefined;
  const on = useTypedEmitter(allLights);

  return (on.value ?? false) ? (
    <MenuIndicatorItem color="hsl(40deg 100% 50%)" />
  ) : null;
};

const AllWindowsState: FunctionComponent<{ room: LevelObject[Level.ROOM] }> = ({
  room,
}) => {
  const allWindows = 'allWindows' in room ? room.allWindows.main : undefined;
  const open = useTypedEmitter(allWindows);

  return (open.value ?? false) ? (
    <MenuIndicatorItem color="hsl(0deg 100% 50%)" />
  ) : null;
};

const DoorState: FunctionComponent<{ room: LevelObject[Level.ROOM] }> = ({
  room,
}) => {
  const fontColor = colors.fontPrimary()();
  const door = 'door' in room ? room.door.open.main : undefined;
  const open = useTypedEmitter(door);

  return (open.value ?? false) ? <MenuIndicatorItem color={fontColor} /> : null;
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
  // @ts-ignore
  floor: LevelObject[Level.FLOOR];
}> = ({ floor }) => {
  const goRoot = useGoRoot();

  // @ts-ignore
  const elements = useMatch(levelObjectMatch[Level.ROOM], floor);
  const sortedElements = useArray(
    useMemo(() => sortBy(elements, '$', roomSorting).all, [elements]),
  );

  const [selectedRoom, selectRoom] = useNavigationRoom();

  return (
    <>
      <MenuSubdivisionHeader>
        <Translation i18nKey={floor.$} />
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
              <Translation capitalize={true} i18nKey={room.$} />
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

  const isScreensaverEnabled = $flags.screensaverEnable.value;
  const flipScreensaverActive = useFlipScreensaverActive();

  const isMenuVisible = useIsMenuVisible();

  const [selectedStaticPage, selectStaticPage] = useNavigationStaticPage();
  const [building] = useNavigationBuilding();

  const floors = useMatch(levelObjectMatch[Level.FLOOR], building);

  const isVisible = useMemo(
    () => (isMenuVisible === null ? true : isMenuVisible),
    [isMenuVisible],
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
                  onClick={() =>
                    isActive ? goRoot?.() : selectStaticPage(staticPage)
                  }
                >
                  <Translation capitalize={true} i18nKey={staticPage} />
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
                  onClick={() =>
                    isActive ? goRoot?.() : selectStaticPage(staticPage)
                  }
                >
                  <Translation capitalize={true} i18nKey={staticPage} />
                </MenuListItem>
              );
            })}
          </MenuList>
        </MenuSubdivision>

        {isScreensaverEnabled ? (
          <MenuSubdivision>
            <MenuList>
              <MenuListItem isActive={false} onClick={flipScreensaverActive}>
                <Translation capitalize={true} i18nKey="startScreensaver" />
              </MenuListItem>
            </MenuList>
          </MenuSubdivision>
        ) : null}
      </MenuContent>
    </MenuComponent>
  );
};
