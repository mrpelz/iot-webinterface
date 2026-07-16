import { styled } from 'goober';
import { ComponentChildren, FunctionComponent } from 'preact';

const OverlayWrapper = styled('overlay' as 'section')`
  display: grid;
  overflow: hidden;
  grid-template-areas: 'a';
`;

const OverlayContent = styled('overlay-content' as 'section')`
  position: relative;
  grid-area: a;

  & > * {
    height: 100%;
  }
`;

export const Overlay: FunctionComponent<{
  overlay?: ComponentChildren;
}> = ({ children, overlay }) => (
  <OverlayWrapper>
    <OverlayContent>{children}</OverlayContent>
    {overlay ? <OverlayContent>{overlay}</OverlayContent> : null}
  </OverlayWrapper>
);
