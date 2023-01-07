import { ComponentChildren, FunctionComponent } from 'preact';
import { styled } from 'goober';

const OverlayWrapper = styled('overlay' as 'section')`
  display: grid;
  grid-template-areas: 'a';
  overflow: hidden;
`;

const OverlayContent = styled('overlay-content' as 'section')`
  grid-area: a;
  position: relative;

  & > * {
    height: 100%;
  }
`;

export const Overlay: FunctionComponent<{
  overlay?: ComponentChildren;
}> = ({ children, overlay }) => {
  return (
    <OverlayWrapper>
      <OverlayContent>{children}</OverlayContent>
      {overlay ? <OverlayContent>{overlay}</OverlayContent> : null}
    </OverlayWrapper>
  );
};
