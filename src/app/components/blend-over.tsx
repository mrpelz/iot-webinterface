import { ComponentChildren, FunctionComponent } from 'preact';
import { styled } from 'goober';
import { useDelay } from '../util/use-delay.js';

const BlendOverWrapper = styled('blend-over' as 'section')`
  display: grid;
  grid-template-areas: 'a';
  overflow: hidden;
`;

const BlendOverContent = styled('blend-over-content' as 'section')<{
  blendOver: number;
}>`
  grid-area: a;
  transition: ${() => useDelay('clip-path 0.3s ease-out', 300) || ''};
`;

const BlendOverContentBase = styled(BlendOverContent)`
  clip-path: ${({ blendOver }) =>
    `inset(0 0 0 ${String(Math.round(blendOver * 100))}%)`};
`;

const BlendOverContentOverlay = styled(BlendOverContent)`
  pointer-events: none;
  clip-path: ${({ blendOver }) =>
    `inset(0 ${String(Math.round((blendOver - 1) * -100))}% 0 0)`};
`;

export const BlendOver: FunctionComponent<{
  blendOver?: number;
  overlay?: ComponentChildren;
}> = ({ blendOver = 0, children, overlay }) => {
  return (
    <BlendOverWrapper>
      <BlendOverContentBase blendOver={blendOver}>
        {children}
      </BlendOverContentBase>
      {overlay ? (
        <BlendOverContentOverlay blendOver={blendOver}>
          {overlay}
        </BlendOverContentOverlay>
      ) : null}
    </BlendOverWrapper>
  );
};
