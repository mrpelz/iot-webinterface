import { styled } from 'goober';
import {
  ComponentChildren,
  FunctionComponent,
  MouseEventHandler,
} from 'preact';
import { useMemo } from 'preact/hooks';

import { useDelay } from '../hooks/use-delay.js';
import { usePrevious } from '../hooks/use-previous.js';

export type BlendOverDirection = 'block' | 'inline';

export const BlendOverWrapper = styled('blend-over' as 'section')`
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'inherit')};
  display: grid;
  grid-template-areas: 'a';
  overflow: hidden;
`;

export const BlendOverContent = styled('blend-over-content' as 'section')`
  grid-area: a;
  position: relative;

  & > * {
    height: 100%;
  }
`;

const BlendOverContentCommon = styled(BlendOverContent)<{
  blendOver: number;
  direction: BlendOverDirection;
  transitionDuration: number;
}>`
  transition: ${({ transitionDuration }) =>
    `clip-path ${transitionDuration}ms linear`};
`;

const BlendOverContentBase = styled(BlendOverContentCommon)`
  clip-path: ${({ blendOver, direction }) =>
    `inset(0 0 ${direction === 'block' ? String(blendOver * 100) : '0'}% ${
      direction === 'inline' ? String(blendOver * 100) : '0'
    }%)`};
`;

const BlendOverContentOverlay = styled(BlendOverContentCommon)`
  clip-path: ${({ blendOver, direction }) =>
    `inset(${direction === 'block' ? String((blendOver - 1) * -100) : '0'}% ${
      direction === 'inline' ? String((blendOver - 1) * -100) : '0'
    }% 0 0)`};
`;

export const BlendOver: FunctionComponent<{
  blendOver?: number;
  direction?: BlendOverDirection;
  invert?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
  overlay?: ComponentChildren;
  transition?: boolean;
  transitionDurationOverride?: number;
}> = ({
  blendOver = 0,
  children,
  direction = 'inline',
  invert = false,
  onClick,
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
    if (transitionDurationOverride) return undefined;

    const delta =
      blendOverPrevious === undefined
        ? 0
        : Math.abs(blendOver - blendOverPrevious);

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
    <BlendOverWrapper onClick={onClick}>
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
