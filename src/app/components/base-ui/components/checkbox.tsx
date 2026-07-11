/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Checkbox — styled wrapper around `@base-ui/react/checkbox`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation example:
 * https://base-ui.com/react/components/checkbox
 *
 * The example also styles an enclosing `<label>` (`.Label`) and ships a check
 * icon; both are re-exported here as `Checkbox.Label` and `Checkbox.CheckIcon`
 * so the documented look is available out of the box.
 */

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

/** Enclosing label used to give the checkbox an accessible name. */
const Label = styled('label', forwardRef)`
  display: flex;
  align-items: center;
  color: oklch(14.5% 0 0deg);
  font-size: 0.875rem;
  font-weight: 400;
  gap: 0.5rem;
  line-height: 1.25rem;

  @media (prefers-color-scheme: dark) {
    color: white;
  }
`;

const Root = styled(BaseCheckbox.Root, forwardRef)`
  display: flex;
  width: 1rem;
  height: 1rem;
  box-sizing: border-box;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid oklch(14.5% 0 0deg);
  border-radius: 0;
  margin: 0;
  background-color: white;
  color: white;

  @media (prefers-color-scheme: dark) {
    border: 1px solid white;
    background-color: oklch(14.5% 0 0deg);
    color: oklch(14.5% 0 0deg);
  }

  &[data-checked],
  &[data-indeterminate] {
    background-color: oklch(14.5% 0 0deg);
    color: white;

    @media (prefers-color-scheme: dark) {
      background-color: white;
      color: oklch(14.5% 0 0deg);
    }
  }

  &:focus-visible {
    outline: 2px solid oklch(14.5% 0 0deg);
    outline-offset: 2px;

    @media (prefers-color-scheme: dark) {
      outline-color: white;
    }
  }
`;

const Indicator = styled(BaseCheckbox.Indicator, forwardRef)`
  display: flex;

  &[data-unchecked] {
    display: none;
  }
`;

/** The check mark icon rendered inside `Checkbox.Indicator` in the example. */
const CheckIcon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  (props, ref) => (
    <svg
      ref={ref}
      fill="none"
      height="16"
      stroke="currentColor"
      viewBox="0 0 16 16"
      width="16"
      {...props}
      style={{
        display: 'block',
        ...(typeof props.style === 'object' && props.style),
      }}
    >
      <path d="m2.5 8.5 4 4 7-9" />
    </svg>
  ),
);

export const Checkbox = {
  ...BaseCheckbox,
  CheckIcon,
  Indicator,
  Label,
  Root,
};
