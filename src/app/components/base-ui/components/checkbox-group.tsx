/* eslint-disable @typescript-eslint/naming-convention */
/**
 * CheckboxGroup — styled wrapper around `@base-ui/react/checkbox-group`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation example
 * (the parent/indeterminate variant, which is the most complete):
 * https://base-ui.com/react/components/checkbox-group
 *
 * `CheckboxGroup` only provides shared state, so the example styles the
 * surrounding structure (caption, per-item label) and re-styles the checkboxes
 * with the group's gray palette. Those helpers are re-exported here as
 * `CheckboxGroup.Caption`, `CheckboxGroup.Item`, `CheckboxGroup.Checkbox`,
 * `CheckboxGroup.Indicator`, `CheckboxGroup.CheckIcon`, and
 * `CheckboxGroup.HorizontalRuleIcon`.
 *
 * The group example relies on CSS variables (`--color-gray-*`, `--color-blue`,
 * `--color-gray-50`) which the Base UI docs define globally. Provide equivalents
 * in your theme, or override these styled parts as needed.
 */

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Root = styled(BaseCheckboxGroup, forwardRef)`
  display: flex;
  flex-direction: column;
  align-items: start;
  color: var(--color-gray-900);
  gap: 0.25rem;
`;

/** Group caption / label element. */
const Caption = styled('div', forwardRef)`
  font-weight: 700;
`;

/** Per-checkbox row (an enclosing `<label>`). */
const Item = styled('label', forwardRef)`
  display: flex;
  align-items: center;
  font-weight: 400;
  gap: 0.5rem;
`;

/** Checkbox styled to match the group example's gray palette. */
const Checkbox = styled(BaseCheckbox.Root, forwardRef)`
  display: flex;
  width: 1.25rem;
  height: 1.25rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 0.25rem;
  margin: 0;
  outline: 0;

  &[data-unchecked] {
    border: 1px solid var(--color-gray-300);
    background-color: transparent;
  }

  &[data-checked] {
    background-color: var(--color-gray-900);
  }

  &[data-indeterminate] {
    border: 1px solid var(--color-gray-300);
    background-color: canvas;
  }

  &:focus-visible {
    outline: 2px solid var(--color-blue);
    outline-offset: 2px;
  }
`;

const Indicator = styled(BaseCheckbox.Indicator, forwardRef)`
  display: flex;
  color: var(--color-gray-50);

  &[data-unchecked] {
    display: none;
  }

  &[data-indeterminate] {
    color: var(--color-gray-900);
  }
`;

const StyledIcon = styled('svg', forwardRef)`
  width: 0.75rem;
  height: 0.75rem;
`;

/** Check mark icon used inside the group's indicator. */
const CheckIcon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  (props, ref) => (
    <StyledIcon
      ref={ref}
      fill="currentcolor"
      viewBox="0 0 10 10"
      {...props}
    >
      <path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" />
    </StyledIcon>
  ),
);

/** Dash icon used to represent the indeterminate (partial) parent state. */
const HorizontalRuleIcon = forwardRef<
  SVGSVGElement,
  React.ComponentProps<'svg'>
>((props, ref) => (
  <StyledIcon
    ref={ref}
    fill="currentcolor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <line
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={3}
      x1="3"
      x2="21"
      y1="12"
      y2="12"
    />
  </StyledIcon>
));

export const CheckboxGroup = Object.assign(Root, {
  Caption,
  CheckIcon,
  Checkbox,
  HorizontalRuleIcon,
  Indicator,
  Item,
});
