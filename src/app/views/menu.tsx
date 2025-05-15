/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  excludePattern,
  Level,
  levelObjectMatch,
} from '@iot/iot-monolith/tree';
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
import { api } from '../main.js';
import { useTypedEmitter } from '../state/api.js';
import { $isMenuVisible } from '../state/menu.js';
import {
  $floors,
  $room,
  $staticPage,
  staticPagesBottom,
  staticPagesTop,
} from '../state/navigation.js';
import { goRoot, setRootPath } from '../state/path.js';
import { flipScreensaverActive } from '../state/screensaver.js';
import { $theme } from '../state/theme.js';
import { colors } from '../style.js';
import { $flags } from '../util/flags.js';
import { Translation } from './translation.js';

// @ts-ignore
const AllLightState: FunctionComponent<{ room: LevelObject[Level.ROOM] }> = ({
  room,
}) => {
  const { main: allLights } = 'allLights' in room ? room.allLights : {};
  const { value: on } = useTypedEmitter(allLights);

  return (on ?? false) ? (
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
  // @ts-ignore
  const door = 'door' in room ? room.door.open.main : undefined;
  const open = useTypedEmitter(door);

  return (open.value ?? false) ? <MenuIndicatorItem color={fontColor} /> : null;
};

const MenuListItem: FunctionComponent<{
  isActive: boolean;
  onClick: () => void;
}> = ({ isActive: active, onClick, children }) => {
  const isMenuVisible = $isMenuVisible.value;
  const isHighContrast = $theme.value === 'highContrast';

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
  const elements = api.match(
    levelObjectMatch[Level.ROOM],
    excludePattern,
    floor,
  );
  const sortedElements = useArray(
    useMemo(() => sortBy(elements, '$', roomSorting).all, [elements]),
  );

  const room = $room.value;

  return (
    <>
      <MenuSubdivisionHeader>
        <Translation i18nKey={floor.$} />
      </MenuSubdivisionHeader>
      <MenuList>
        {sortedElements.map((room_, key) => {
          const isActive = room_ === room;

          return (
            <MenuListItem
              key={key}
              isActive={isActive}
              onClick={() => (isActive ? goRoot() : setRootPath(room_.$))}
            >
              <Translation capitalize={true} i18nKey={room_.$} />
              <MenuIndicatorSection>
                <AllWindowsState room={room_} />
                <DoorState room={room_} />
                <AllLightState room={room_} />
              </MenuIndicatorSection>
            </MenuListItem>
          );
        })}
      </MenuList>
    </>
  );
};

export const Menu: FunctionComponent = () => {
  const isScreensaverEnabled = $flags.screensaverEnable.value;

  const isMenuVisible = $isMenuVisible.value;

  const floors = $floors.value;
  const staticPage = $staticPage.value;

  const isVisible = useMemo(
    () => (isMenuVisible === null ? true : isMenuVisible),
    [isMenuVisible],
  );

  return (
    <MenuComponent isVisible={isVisible}>
      <MenuContent>
        <MenuSubdivision>
          <MenuList>
            {staticPagesTop.map((staticPage_, key) => {
              const isActive = staticPage_ === staticPage;

              return (
                <MenuListItem
                  key={key}
                  isActive={isActive}
                  onClick={() =>
                    isActive ? goRoot() : setRootPath(staticPage_)
                  }
                >
                  <Translation capitalize={true} i18nKey={staticPage_} />
                </MenuListItem>
              );
            })}
          </MenuList>
        </MenuSubdivision>

        <MenuSubdivision>
          {floors?.map((floor, key) => <Floor key={key} floor={floor} />)}
        </MenuSubdivision>

        <MenuSubdivision>
          <MenuList>
            {staticPagesBottom.map((staticPage_, key) => {
              const isActive = staticPage_ === staticPage;

              return (
                <MenuListItem
                  key={key}
                  isActive={isActive}
                  onClick={() =>
                    isActive ? goRoot() : setRootPath(staticPage_)
                  }
                >
                  <Translation capitalize={true} i18nKey={staticPage_} />
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
