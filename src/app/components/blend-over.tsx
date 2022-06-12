import { ComponentChildren, FunctionComponent } from 'preact';
import { styled } from 'goober';

const BlendOverWrapper = styled('blend-over' as 'section')`
  display: grid;
  grid-template-areas: 'a';
  overflow: hidden;
`;

const BlendOverContent = styled('blend-over-content' as 'section')`
  grid-area: a;
`;

const BlendOverOverlay = styled(BlendOverContent)<{
  blendOver: number;
}>`
  pointer-events: none;
  transition: clip-path 0.3s ease-out;

  clip-path: inset(
    0 ${({ blendOver }) => Math.round((blendOver - 1) * -100)}% 0 0
  );
`;

export const BlendOver: FunctionComponent<{
  blendOver?: number;
  overlay: ComponentChildren;
}> = ({ blendOver = 0, children, overlay }) => {
  return (
    <BlendOverWrapper>
      <BlendOverContent>{children}</BlendOverContent>
      <BlendOverOverlay blendOver={blendOver}>{overlay}</BlendOverOverlay>
    </BlendOverWrapper>
  );
};
