import { styled } from 'goober';
import { ComponentChildren, FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { useDelay } from '../hooks/use-delay.js';
import { usePrevious } from '../hooks/use-previous.js';

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
  position: relative;
  transition: ${({ transitionDuration }) =>
    `clip-path ${transitionDuration}ms linear`};

  & > * {
    height: 100%;
  }
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
  invert?: boolean;
  overlay?: ComponentChildren;
  transition?: boolean;
  transitionDurationOverride?: number;
}> = ({
  blendOver = 0,
  children,
  direction = 'inline',
  invert = false,
  overlay,
  transition = true,
  transitionDurationOverride,
}) => {
  const [blendOverPrevious] = usePrevious(blendOver);

  const transitionDurationWithoutUserInput = useMemo(() => {
    if (transitionDurationOverride) return transitionDurationOverride;
    return direction === 'inline' ? 600 : 300;
  }, [direction, transitionDurationOverride]);

  const transitionDurationFractional = useMemo(() => {
    if (transitionDurationOverride) return null;

    const delta =
      blendOverPrevious === null ? 0 : Math.abs(blendOver - blendOverPrevious);

    return transitionDurationWithoutUserInput * delta;
  }, [
    blendOver,
    blendOverPrevious,
    transitionDurationOverride,
    transitionDurationWithoutUserInput,
  ]);

  const transitionDurationWithoutUserInputDelayed = useDelay(
    transitionDurationWithoutUserInput,
    transitionDurationWithoutUserInput * 2,
  );

  const transitionDuration = useMemo(
    () =>
      (transition &&
        (transitionDurationFractional ||
          transitionDurationWithoutUserInputDelayed)) ||
      0,
    [
      transition,
      transitionDurationFractional,
      transitionDurationWithoutUserInputDelayed,
    ],
  );

  return (
    <BlendOverWrapper>
      <BlendOverContentBase
        blendOver={blendOver}
        direction={direction}
        transitionDuration={transitionDuration}
      >
        {invert && overlay ? overlay : children}
      </BlendOverContentBase>
      {overlay ? (
        <BlendOverContentOverlay
          blendOver={blendOver}
          direction={direction}
          transitionDuration={transitionDuration}
        >
          {invert ? children : overlay}
        </BlendOverContentOverlay>
      ) : null}
    </BlendOverWrapper>
  );
};
