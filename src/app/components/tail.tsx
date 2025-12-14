import { styled } from 'goober';
import { FunctionComponent } from 'preact';

import { colors, dimensions, strings } from '../style.js';

const TailContainer = styled('tail' as 'section')`
  background-color: ${colors.backgroundSecondary()};
  block-size: 100%;
  display: flex;
  flex-direction: column-reverse;
  inline-size: 100%;
  overflow-block: auto;
  padding-block-end: ${strings.safeAreaInsetBottom};
  padding-inline: ${dimensions.fontPadding};
  position: absolute;
`;

export const Tail: FunctionComponent = ({ children }) => (
  <TailContainer>
    <div>{children}</div>
  </TailContainer>
);
