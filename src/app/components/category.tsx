import { ComponentChild, FunctionComponent } from 'preact';
import { colors, dimensions } from '../style.js';
import { styled } from 'goober';

const CategoryWrapper = styled('section')`
  display: flow-root;
`;

const CategoryHeader = styled('header')`
  background-color: ${colors.backgroundSecondary(80)};
  font-size: ${dimensions.fontSizeSmall};
  font-weight: 600;
  height: ${dimensions.fontSizeLarge};
  line-height: ${dimensions.fontSizeLarge};
  padding: 0 ${dimensions.fontPadding};
  position: sticky;
  top: ${dimensions.headerHeight};
`;

export const Category: FunctionComponent<{ header: ComponentChild }> = ({
  children,
  header,
}) => (
  <CategoryWrapper>
    <CategoryHeader>{header}</CategoryHeader>
    {children}
  </CategoryWrapper>
);
