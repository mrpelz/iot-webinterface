/* eslint-disable @typescript-eslint/naming-convention */
/**
 * OTPField — styled wrapper around `@base-ui/react/otp-field`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation examples:
 * https://base-ui.com/react/components/otp-field
 *
 * Layout helpers from the examples are re-exported: `OTPField.Field` (the
 * outer wrapper), `OTPField.Label`, and `OTPField.Group` (for chunked layouts
 * such as `123-456`).
 */
import { OTPField as BaseOTPField } from '@base-ui/react/otp-field';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

/** Outer wrapper laying out the label, inputs, and description. */
const Field = styled('div', forwardRef)`
  display: flex;
  width: 100%;
  max-width: 20rem;
  flex-direction: column;
  align-items: start;
  gap: 0.25rem;
`;

/** Label used to give the field an accessible name. */
const Label = styled('label', forwardRef)`
  color: oklch(14.5% 0 0deg);
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.25rem;

  @media (prefers-color-scheme: dark) {
    color: white;
  }
`;

const Root = styled(BaseOTPField.Root, forwardRef)`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.5rem;
`;

/** Wrapper for a subset of inputs in chunked layouts. */
const Group = styled('div', forwardRef)`
  display: flex;
  gap: 0.5rem;
`;

const Input = styled(BaseOTPField.Input, forwardRef)`
  width: 2.5rem;
  height: 2.5rem;
  box-sizing: border-box;
  padding: 0;
  border: 1px solid oklch(14.5% 0 0deg);
  border-radius: 0;
  margin: 0;
  background-color: white;
  color: oklch(14.5% 0 0deg);
  font-family: inherit;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5rem;
  text-align: center;

  @media (prefers-color-scheme: dark) {
    border: 1px solid white;
    background-color: oklch(14.5% 0 0deg);
    color: white;
  }

  &::placeholder {
    color: oklch(43.9% 0 0deg);

    @media (prefers-color-scheme: dark) {
      color: oklch(70.8% 0 0deg);
    }
  }

  &:focus {
    outline: 2px solid oklch(14.5% 0 0deg);
    outline-offset: -1px;

    @media (prefers-color-scheme: dark) {
      outline-color: white;
    }
  }

  &:focus::placeholder {
    color: transparent;
  }
`;

const Separator = styled(BaseOTPField.Separator, forwardRef)`
  width: 1rem;
  height: 1px;
  background-color: currentcolor;
  color: oklch(14.5% 0 0deg);

  @media (prefers-color-scheme: dark) {
    color: white;
  }
`;

export const OTPField = {
  ...BaseOTPField,
  Field,
  Group,
  Input,
  Label,
  Root,
  Separator,
};
