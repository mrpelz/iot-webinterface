import { colors, dimensions } from '../style.js';
import { staticPages, useRoom, useStaticPage } from '../hooks/navigation.js';
import { FunctionComponent } from 'preact';
import { Translation } from '../hooks/i18n.js';
import { styled } from 'goober';

const _Menu = styled('nav')`
  background-color: ${colors.surface1()};
  border-inline-end: ${dimensions.hairline} solid ${colors.text2()};
  min-height: ${dimensions.appHeight};
  padding: ${dimensions.titlebarHeight} 0;
  width: ${dimensions.menuWidth};
`;

const _MenuListHeader = styled('span')`
  font-size: 0.75rem;
  padding: 0 0.5rem;
  text-transform: uppercase;
`;

const _MenuList = styled('ul')``;

const _MenuListItem = styled('li')``;

export const Menu: FunctionComponent = () => {
  const { setState: selectStaticPage, state: selectedStaticPage } =
    useStaticPage();

  const {
    elements: floors,
    setState: selectRoom,
    state: selectedRoom,
  } = useRoom();

  // eslint-disable-next-line no-console
  console.log(floors);

  return (
    <_Menu>
      <_MenuListHeader>static</_MenuListHeader>
      <_MenuList>
        {staticPages.map((staticPage, key) => (
          <li key={key} onClick={() => selectStaticPage(staticPage)}>
            <_MenuListItem>
              <Translation i18nKey={staticPage} />
              {staticPage === selectedStaticPage ? '*' : null}
            </_MenuListItem>
          </li>
        ))}
      </_MenuList>
      {floors.map(({ elements, floor }, outerKey) => (
        <>
          <_MenuListHeader key={outerKey}>
            <Translation i18nKey={floor.meta.name} />
          </_MenuListHeader>
          <_MenuList key={outerKey}>
            {elements.map((room, innerKey) => (
              <_MenuListItem key={innerKey} onClick={() => selectRoom(room)}>
                <Translation i18nKey={room.meta.name} />
                {room === selectedRoom ? '*' : null}
              </_MenuListItem>
            ))}
          </_MenuList>
        </>
      ))}
    </_Menu>
  );
};
