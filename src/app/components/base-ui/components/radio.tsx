/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Radio — styled wrappers around `@base-ui/react/radio` and
 * `@base-ui/react/radio-group`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation example:
 * https://base-ui.com/react/components/radio
 *
 * Radio is always used inside a RadioGroup, so both are exported from this file.
 * The example's `Caption` (group label) and `Item` (enclosing `<label>`) helpers
 * are re-exported as `Radio.Caption` and `Radio.Item`.
 */
import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

export const RadioGroup = styled(BaseRadioGroup, forwardRef)`
  display: flex;
  flex-direction: column;
  align-items: start;
  color: oklch(14.5% 0 0deg);
  gap: 0.25rem;

  @media (prefers-color-scheme: dark) {
    color: white;
  }
`;

/** Group caption / label element. */
const Caption = styled('div', forwardRef)`
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.25rem;
`;

/** Per-radio row (an enclosing `<label>`). */
const Item = styled('label', forwardRef)`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 400;
  gap: 0.5rem;
  line-height: 1.25rem;
`;

const Root = styled(BaseRadio.Root, forwardRef)`
  display: flex;
  width: 1rem;
  height: 1rem;
  box-sizing: border-box;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid oklch(14.5% 0 0deg);
  border-radius: 100%;
  margin: 0;
  background-color: white;
  color: white;

  @media (prefers-color-scheme: dark) {
    border: 1px solid white;
    background-color: oklch(14.5% 0 0deg);
    color: oklch(14.5% 0 0deg);
  }

  &[data-checked] {
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

const Indicator = styled(BaseRadio.Indicator, forwardRef)`
  display: flex;
  align-items: center;
  justify-content: center;

  &[data-unchecked] {
    display: none;
  }

  &::before {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 100%;
    background-color: currentcolor;
    content: '';
  }
`;

export const Radio = {
  ...BaseRadio,
  Caption,
  Group: RadioGroup,
  Indicator,
  Item,
  Root,
};
