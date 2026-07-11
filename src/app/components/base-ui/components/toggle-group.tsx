/* eslint-disable @typescript-eslint/naming-convention */
/**
 * ToggleGroup — styled wrapper around `@base-ui/react/toggle-group`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation example:
 * https://base-ui.com/react/components/toggle-group
 *
 * The group example styles its child toggles with a `[data-pressed]` filled
 * look, so a group-scoped `ToggleGroup.Button` (a styled `Toggle`) is exported
 * alongside the root. The example's alignment icons are also re-exported.
 */

import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Root = styled(BaseToggleGroup, forwardRef)`
  display: flex;
  padding: 1px;
  border: 1px solid oklch(14.5% 0 0deg);
  gap: 1px;

  @media (prefers-color-scheme: dark) {
    border: 1px solid white;
  }
`;

/** Toggle styled for use inside a ToggleGroup (filled when pressed). */
const Button = styled(BaseToggle, forwardRef)`
  display: flex;
  width: 2rem;
  height: 2rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 0;
  margin: 0;
  background-color: transparent;
  color: oklch(14.5% 0 0deg);
  user-select: none;

  @media (prefers-color-scheme: dark) {
    color: white;
  }

  @media (hover: hover) {
    &:hover:not([data-disabled]) {
      background-color: oklch(97% 0 0deg);

      @media (prefers-color-scheme: dark) {
        background-color: oklch(26.9% 0 0deg);
      }
    }
  }

  &:focus-visible {
    outline: 2px solid oklch(14.5% 0 0deg);
    outline-offset: 1px;

    @media (prefers-color-scheme: dark) {
      outline-color: white;
    }
  }

  &:active:not([data-disabled], [data-pressed]) {
    background-color: oklch(92.2% 0 0deg);

    @media (prefers-color-scheme: dark) {
      background-color: oklch(37.1% 0 0deg);
    }
  }

  &[data-pressed] {
    background-color: oklch(14.5% 0 0deg);
    color: white;

    @media (prefers-color-scheme: dark) {
      background-color: white;
      color: oklch(14.5% 0 0deg);
    }
  }

  @media (hover: hover) {
    &[data-pressed]:hover:not([data-disabled]) {
      background-color: oklch(14.5% 0 0deg);
      color: white;

      @media (prefers-color-scheme: dark) {
        background-color: white;
        color: oklch(14.5% 0 0deg);
      }
    }
  }
`;

function makeIcon(path: string, fill = false) {
  return forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
    (props, ref) => (
      <svg
        ref={ref}
        fill={fill ? 'currentColor' : 'none'}
        height="16"
        stroke={fill ? undefined : 'currentColor'}
        viewBox="0 0 16 16"
        width="16"
        {...props}
        style={{
          display: 'block',
          ...(typeof props.style === 'object' && props.style),
        }}
      >
        <path
          d={path}
          strokeLinecap={fill ? undefined : 'square'}
          strokeLinejoin={fill ? undefined : 'round'}
        />
      </svg>
    ),
  );
}

const AlignLeftIcon = makeIcon('M2.5 4.5h11m-11 7h9M2.5 8h5');
const AlignCenterIcon = makeIcon('M2.5 4.5h11m-10 7h9M5.5 8h5');
const AlignRightIcon = makeIcon('M2.5 4.5h11m-9 7h9M8.5 8h5');

export const ToggleGroup = Object.assign(Root, {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  Button,
});
