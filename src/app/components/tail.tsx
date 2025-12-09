import { styled } from 'goober';
import { FunctionComponent } from 'preact';

const TailContainer = styled('tail' as 'section')`
  block-size: 100%;
  display: flex;
  flex-direction: column-reverse;
  inline-size: 100%;
  overflow-block: auto;
  position: absolute;
`;

export const Tail: FunctionComponent = ({ children }) => (
  <TailContainer>
    <div>{children}</div>
  </TailContainer>
);
