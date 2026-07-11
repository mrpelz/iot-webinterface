/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Progress — styled wrapper around `@base-ui/react/progress`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation example:
 * https://base-ui.com/react/components/progress
 *
 * The example references docs-global CSS variables (`--color-gray-*`); see
 * `theme.css` in this library for equivalents.
 */
import { Progress as BaseProgress } from '@base-ui/react/progress';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Root = styled(BaseProgress.Root, forwardRef)`
  display: grid;
  width: 12rem;
  gap: 0.25rem;
  grid-template-columns: 1fr 1fr;
  row-gap: 0.5rem;
`;

const Label = styled(BaseProgress.Label, forwardRef)`
  color: var(--color-gray-900);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
`;

const Value = styled(BaseProgress.Value, forwardRef)`
  margin: 0;
  color: var(--color-gray-900);
  font-size: 0.875rem;
  grid-column-start: 2;
  line-height: 1.25rem;
  text-align: right;
`;

const Track = styled(BaseProgress.Track, forwardRef)`
  overflow: hidden;
  height: 0.25rem;
  border-radius: 0.25rem;
  background-color: var(--color-gray-200);
  box-shadow: inset 0 0 0 1px var(--color-gray-200);
  grid-column: 1 / 3;
`;

const Indicator = styled(BaseProgress.Indicator, forwardRef)`
  display: block;
  background-color: var(--color-gray-500);
  transition: width 500ms;
`;

export const Progress = {
  ...BaseProgress,
  Indicator,
  Label,
  Root,
  Track,
  Value,
};
