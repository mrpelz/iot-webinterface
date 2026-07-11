/**
 * Form — styled wrapper around `@base-ui/react/form`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation example:
 * https://base-ui.com/react/components/form
 *
 * Form is a single `<form>` element. The example composes it with `Field` and
 * `Button`, both of which are styled separately in this library.
 */
import { Form as BaseForm } from '@base-ui/react/form';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

export const Form = styled(BaseForm, forwardRef)`
  display: flex;
  width: 100%;
  max-width: 16rem;
  flex-direction: column;
  gap: 1rem;
`;
