/* eslint-disable @typescript-eslint/naming-convention */
/**
 * NumberField — styled wrapper around `@base-ui/react/number-field`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation example:
 * https://base-ui.com/react/components/number-field
 *
 * References docs-global CSS variables (`--color-gray-*`, `--color-blue`); see
 * `theme.css`. The example's `.Label` helper and the cursor/plus/minus icons
 * are re-exported as `NumberField.Label`, `.CursorGrowIcon`, `.PlusIcon`,
 * `.MinusIcon`.
 */

import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import { css, styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { bindComponent } from '../../../util/combine-components.js';

const Root = styled(BaseNumberField.Root, forwardRef)`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 0.25rem;
`;

const ScrubArea = styled(BaseNumberField.ScrubArea, forwardRef)`
  cursor: ew-resize;
  font-weight: 700;
  user-select: none;
`;

const ScrubAreaCursor = styled(BaseNumberField.ScrubAreaCursor, forwardRef)`
  filter: drop-shadow(0 1px 1px #0008);
`;

/** Label element used inside the scrub area in the example. */
const Label = styled('label', forwardRef)`
  color: var(--color-gray-900);
  cursor: ew-resize;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.25rem;
`;

const Group = styled(BaseNumberField.Group, forwardRef)`
  display: flex;
`;

const Input = styled(BaseNumberField.Input, forwardRef)`
  width: 6rem;
  height: 2.5rem;
  box-sizing: border-box;
  padding: 0;
  border-radius: 0;
  border-top: 1px solid var(--color-gray-200);
  border-right: none;
  border-bottom: 1px solid var(--color-gray-200);
  border-left: none;
  margin: 0;
  background-color: transparent;
  color: var(--color-gray-900);
  font-family: inherit;
  font-size: 1rem;
  font-variant-numeric: tabular-nums;
  font-weight: 400;
  text-align: center;

  &:focus {
    z-index: 1;
    outline: 2px solid var(--color-blue);
    outline-offset: -1px;
  }
`;

const stepperStyles = css`
  display: flex;
  width: 2.5rem;
  height: 2.5rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid var(--color-gray-200);
  border-radius: 0.375rem;
  margin: 0;
  background-clip: padding-box;
  background-color: var(--color-gray-50);
  color: var(--color-gray-900);
  outline: 0;
  user-select: none;

  @media (hover: hover) {
    &:hover {
      background-color: var(--color-gray-100);
    }
  }

  &:active {
    background-color: var(--color-gray-100);
  }
`;

const Decrement = styled(
  bindComponent(BaseNumberField.Decrement, { className: stepperStyles }),
  forwardRef,
)`
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
`;

const Increment = styled(
  bindComponent(BaseNumberField.Increment, { className: stepperStyles }),
  forwardRef,
)`
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
`;

const CursorGrowIcon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  (props, ref) => (
    <svg
      ref={ref}
      fill="black"
      height="14"
      stroke="white"
      viewBox="0 0 24 14"
      width="26"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M19.5 5.5L6.49737 5.51844V2L1 6.9999L6.5 12L6.49737 8.5L19.5 8.5V12L25 6.9999L19.5 2V5.5Z" />
    </svg>
  ),
);

const PlusIcon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  (props, ref) => (
    <svg
      ref={ref}
      fill="none"
      height="10"
      stroke="currentcolor"
      strokeWidth="1.6"
      viewBox="0 0 10 10"
      width="10"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M0 5H5M10 5H5M5 5V0M5 5V10" />
    </svg>
  ),
);

const MinusIcon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  (props, ref) => (
    <svg
      ref={ref}
      fill="none"
      height="10"
      stroke="currentcolor"
      strokeWidth="1.6"
      viewBox="0 0 10 10"
      width="10"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M0 5H10" />
    </svg>
  ),
);

export const NumberField = {
  ...BaseNumberField,
  CursorGrowIcon,
  Decrement,
  Group,
  Increment,
  Input,
  Label,
  MinusIcon,
  PlusIcon,
  Root,
  ScrubArea,
  ScrubAreaCursor,
};
