/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Field — styled wrapper around `@base-ui/react/field`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation example:
 * https://base-ui.com/react/components/field
 *
 * Parts without dedicated CSS in the example (Item, Validity) pass through from
 * Base UI unstyled.
 */
import { Field as BaseField } from '@base-ui/react/field';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Root = styled(BaseField.Root, forwardRef)`
  display: flex;
  width: 100%;
  max-width: 16rem;
  flex-direction: column;
  align-items: start;
  gap: 0.25rem;
`;

const Label = styled(BaseField.Label, forwardRef)`
  color: oklch(14.5% 0 0deg);
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.25rem;

  @media (prefers-color-scheme: dark) {
    color: white;
  }
`;

const Control = styled(BaseField.Control, forwardRef)`
  width: 100%;
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

const Error = styled(BaseField.Error, forwardRef)`
  color: oklch(50.5% 0.213 27.518deg);
  font-size: 0.875rem;
  line-height: 1.25rem;

  @media (prefers-color-scheme: dark) {
    color: oklch(70.4% 0.191 22.216deg);
  }
`;

const Description = styled(BaseField.Description, forwardRef)`
  margin: 0;
  color: oklch(43.9% 0 0deg);
  font-size: 0.875rem;
  line-height: 1.25rem;

  @media (prefers-color-scheme: dark) {
    color: oklch(70.8% 0 0deg);
  }
`;

export const Field = {
  ...BaseField,
  Control,
  Description,
  Error,
  Label,
  Root,
};
