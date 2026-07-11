/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Fieldset — styled wrapper around `@base-ui/react/fieldset`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation example:
 * https://base-ui.com/react/components/fieldset
 *
 * The example also styles nested `Field` parts; those live in `Field.tsx`.
 * Compose `Fieldset` with the styled `Field` from this library.
 */
import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Root = styled(BaseFieldset.Root, forwardRef)`
  display: flex;
  width: 100%;
  max-width: 16rem;
  flex-direction: column;
  padding: 0;
  border: 0;
  margin: 0;
  gap: 1rem;
`;

const Legend = styled(BaseFieldset.Legend, forwardRef)`
  border-bottom: 1px solid oklch(14.5% 0 0deg);
  color: oklch(14.5% 0 0deg);
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5rem;

  @media (prefers-color-scheme: dark) {
    border-bottom: 1px solid white;
    color: white;
  }
`;

export const Fieldset = {
  ...BaseFieldset,
  Legend,
  Root,
};
