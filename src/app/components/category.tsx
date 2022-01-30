import { ComponentChild, FunctionComponent } from 'preact';
import { colors, dimensions } from '../style.js';
import { styled } from 'goober';

export const CategoryWrapper = styled('section')`
  display: flow-root;
`;

export const CategoryHeader = styled('header')`
  background-color: ${colors.backgroundSecondary(80)};
  font-size: ${dimensions.fontSizeSmall};
  font-weight: 600;
  height: ${dimensions.fontSizeLarge};
  line-height: ${dimensions.fontSizeLarge};
  padding: 0 1ch;
  position: sticky;
  top: ${dimensions.headerHeight};
`;

export const CategoryContent = styled('main')`
  margin: 1ch;
`;

export const Category: FunctionComponent<{ header: ComponentChild }> = ({
  children,
  header,
}) => (
  <CategoryWrapper>
    <CategoryHeader>{header}</CategoryHeader>
    <CategoryContent>{children}</CategoryContent>
  </CategoryWrapper>
);
