/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Meter — styled wrapper around `@base-ui/react/meter`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation example:
 * https://base-ui.com/react/components/meter
 */
import { Meter as BaseMeter } from '@base-ui/react/meter';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Root = styled(BaseMeter.Root, forwardRef)`
  display: grid;
  width: 15rem;
  max-width: 100%;
  grid-template-columns: 1fr 1fr;
  row-gap: 0.5rem;
`;

const Label = styled(BaseMeter.Label, forwardRef)`
  color: oklch(14.5% 0 0deg);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;

  @media (prefers-color-scheme: dark) {
    color: white;
  }
`;

const Value = styled(BaseMeter.Value, forwardRef)`
  color: oklch(14.5% 0 0deg);
  font-size: 0.875rem;
  line-height: 1.25rem;
  text-align: right;

  @media (prefers-color-scheme: dark) {
    color: white;
  }
`;

const Track = styled(BaseMeter.Track, forwardRef)`
  overflow: hidden;
  height: 0.75rem;
  background-color: oklch(92.2% 0 0deg);
  grid-column: 1 / 3;

  @media (prefers-color-scheme: dark) {
    background-color: oklch(26.9% 0 0deg);
  }
`;

const Indicator = styled(BaseMeter.Indicator, forwardRef)`
  background-color: oklch(14.5% 0 0deg);
  transition: width 500ms;

  @media (prefers-color-scheme: dark) {
    background-color: white;
  }
`;

export const Meter = {
  ...BaseMeter,
  Indicator,
  Label,
  Root,
  Track,
  Value,
};
