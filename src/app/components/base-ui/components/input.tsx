/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Input — styled wrapper around `@base-ui/react/input`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation example:
 * https://base-ui.com/react/components/input
 *
 * Input is a single `<input>` element. The example's enclosing `<label>` style
 * (`.Label`) is re-exported as `Input.Label` for the documented look.
 */
import { Input as BaseInput } from '@base-ui/react/input';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const StyledInput = styled(BaseInput, forwardRef)`
  width: 10rem;
  height: 2rem;
  box-sizing: border-box;
  padding: 0 0.5rem;
  border: 1px solid oklch(14.5% 0 0deg);
  border-radius: 0;
  margin: 0;
  background-color: white;
  color: oklch(14.5% 0 0deg);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;

  @media (any-pointer: coarse) {
    font-size: 1rem;
    line-height: 1.5rem;
  }

  @media (prefers-color-scheme: dark) {
    border: 1px solid white;
    background-color: oklch(14.5% 0 0deg);
    color: white;
  }

  &::placeholder {
    color: oklch(55.6% 0 0deg);

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
`;

/** Enclosing label used to give the input an accessible name. */
const Label = styled('label', forwardRef)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: oklch(14.5% 0 0deg);
  font-size: 0.875rem;
  font-weight: 700;
  gap: 0.25rem;
  line-height: 1.25rem;

  @media (prefers-color-scheme: dark) {
    color: white;
  }
`;

export const Input = Object.assign(StyledInput, { Label });
