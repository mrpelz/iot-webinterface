import { ComponentChildren, FunctionComponent } from 'preact';
import { styled } from 'goober';
import { useDelay } from '../hooks/use-delay.js';
import { useMemo } from 'preact/hooks';

export type BlendOverDirection = 'block' | 'inline';

const BlendOverWrapper = styled('blend-over' as 'section')`
  display: grid;
  grid-template-areas: 'a';
  overflow: hidden;
`;

const BlendOverContent = styled('blend-over-content' as 'section')<{
  blendOver: number;
  direction: BlendOverDirection;
  transitionDuration: number;
}>`
  grid-area: a;
  transition: ${({ transitionDuration }) =>
    `clip-path ${transitionDuration}ms linear`};
`;

const BlendOverContentBase = styled(BlendOverContent)`
  clip-path: ${({ blendOver, direction }) =>
    `inset(0 0 ${direction === 'block' ? String(blendOver * 100) : '0'}% ${
      direction === 'inline' ? String(blendOver * 100) : '0'
    }%)`};
`;

const BlendOverContentOverlay = styled(BlendOverContent)`
  clip-path: ${({ blendOver, direction }) =>
    `inset(${direction === 'block' ? String((blendOver - 1) * -100) : '0'}% ${
      direction === 'inline' ? String((blendOver - 1) * -100) : '0'
    }% 0 0)`};
`;

export const BlendOver: FunctionComponent<{
  blendOver?: number;
  direction?: BlendOverDirection;
  overlay?: ComponentChildren;
  transition?: boolean;
}> = ({
  blendOver = 0,
  children,
  direction = 'inline',
  overlay,
  transition = true,
}) => {
  const transitionDurationWithoutUserInput = useMemo(
    () => (direction === 'inline' ? 600 : 300),
    [direction]
  );
  const transitionDurationWithoutUserInputDelayed = useDelay(
    transitionDurationWithoutUserInput,
    transitionDurationWithoutUserInput * 2
  );

  const transitionDuration = useMemo(
    () => (transition && transitionDurationWithoutUserInputDelayed) || 0,
    [transitionDurationWithoutUserInputDelayed, transition]
  );

  return (
    <BlendOverWrapper>
      <BlendOverContentBase
        blendOver={blendOver}
        direction={direction}
        transitionDuration={transitionDuration}
      >
        {children}
      </BlendOverContentBase>
      {overlay ? (
        <BlendOverContentOverlay
          blendOver={blendOver}
          direction={direction}
          transitionDuration={transitionDuration}
        >
          {overlay}
        </BlendOverContentOverlay>
      ) : null}
    </BlendOverWrapper>
  );
};
