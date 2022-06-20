import { ComponentChildren, FunctionComponent } from 'preact';
import { styled } from 'goober';
import { useDelay } from '../hooks/use-delay.js';

export type BlendOverDirection = 'block' | 'inline';

const BlendOverWrapper = styled('blend-over' as 'section')`
  display: grid;
  grid-template-areas: 'a';
  overflow: hidden;
`;

const BlendOverContent = styled('blend-over-content' as 'section')<{
  blendOver: number;
  direction: BlendOverDirection;
}>`
  grid-area: a;
  transition: ${({ direction }) => {
    const duration = direction === 'inline' ? 600 : 300;
    return useDelay(`clip-path ${duration}ms ease-out`, duration) || '';
  }};
`;

const BlendOverContentBase = styled(BlendOverContent)`
  clip-path: ${({ blendOver, direction }) =>
    `inset(0 0 ${
      direction === 'block' ? String(Math.round(blendOver * 100)) : '0'
    }% ${
      direction === 'inline' ? String(Math.round(blendOver * 100)) : '0'
    }%)`};
`;

const BlendOverContentOverlay = styled(BlendOverContent)`
  clip-path: ${({ blendOver, direction }) =>
    `inset(${
      direction === 'block' ? String(Math.round((blendOver - 1) * -100)) : '0'
    }% ${
      direction === 'inline' ? String(Math.round((blendOver - 1) * -100)) : '0'
    }% 0 0)`};
`;

export const BlendOver: FunctionComponent<{
  blendOver?: number;
  direction?: BlendOverDirection;
  overlay?: ComponentChildren;
}> = ({ blendOver = 0, children, direction = 'inline', overlay }) => {
  return (
    <BlendOverWrapper>
      <BlendOverContentBase blendOver={blendOver} direction={direction}>
        {children}
      </BlendOverContentBase>
      {overlay ? (
        <BlendOverContentOverlay blendOver={blendOver} direction={direction}>
          {overlay}
        </BlendOverContentOverlay>
      ) : null}
    </BlendOverWrapper>
  );
};
