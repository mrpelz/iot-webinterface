import { colors, dimensions } from '../style.js';
import { staticPages, useRoom, useStaticPage } from '../hooks/navigation.js';
import { FunctionComponent } from 'preact';
import { Translation } from '../hooks/i18n.js';
import { dependentValue } from '../style/main.js';
import { styled } from 'goober';

const _Menu = styled('nav')`
  background-color: ${colors.backgroundSecondary()};
  border-inline-end: ${dimensions.hairline} solid ${colors.fontTertiary()};
  min-height: ${dimensions.appHeight};
  padding: ${dimensions.titlebarHeight} 0;
  width: ${dimensions.menuWidth};
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

const _MenuListItem = styled('li')<{ active: boolean }>`
  background-color: ${dependentValue(
    'active',
    colors.selection(),
    colors.backgroundPrimary()
  )};
  border-block-end: ${dimensions.hairline} solid ${colors.fontTertiary()};
  border-block-start: ${dimensions.hairline} solid ${colors.fontTertiary()};
  color: ${dependentValue(
    'active',
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
          <_MenuSubdivisionHeader>static</_MenuSubdivisionHeader>
          <_MenuList>
            {staticPages.map((staticPage, key) => (
              <_MenuListItem
                key={key}
                active={staticPage === selectedStaticPage}
                onClick={() => selectStaticPage(staticPage)}
              >
                <Translation i18nKey={staticPage} />
              </_MenuListItem>
            ))}
          </_MenuList>
        </_MenuSubdivision>
        <_MenuSubdivision>
          {floors.map(({ elements, floor }, outerKey) => (
            <>
              <_MenuSubdivisionHeader key={outerKey}>
                <Translation i18nKey={floor.meta.name} />
              </_MenuSubdivisionHeader>
              <_MenuList key={outerKey}>
                {elements.map((room, innerKey) => (
                  <_MenuListItem
                    key={innerKey}
                    active={room === selectedRoom}
                    onClick={() => selectRoom(room)}
                  >
                    <Translation i18nKey={room.meta.name} />
                  </_MenuListItem>
                ))}
              </_MenuList>
            </>
          ))}
        </_MenuSubdivision>
      </_MenuContent>
    </_Menu>
  );
};
