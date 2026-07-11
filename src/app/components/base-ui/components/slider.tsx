/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Slider — styled wrapper around `@base-ui/react/slider`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation examples:
 * https://base-ui.com/react/components/slider
 *
 * The Control/Track rules merge the horizontal (primary) and vertical demos'
 * verbatim CSS so both orientations work. References docs-global CSS variables
 * (`--color-gray-*`, `--color-blue`); see `theme.css`.
 */
import { Slider as BaseSlider } from '@base-ui/react/slider';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Control = styled(BaseSlider.Control, forwardRef)`
  display: flex;
  width: 14rem;
  box-sizing: border-box;
  align-items: center;
  padding-block: 0.75rem;
  touch-action: none;
  user-select: none;

  &[data-orientation='vertical'] {
    width: auto;
    height: 8rem;
    padding-block: 0;
    padding-inline: 0.75rem;
  }
`;

const Track = styled(BaseSlider.Track, forwardRef)`
  width: 100%;
  height: 0.25rem;
  border-radius: 0.25rem;
  background-color: var(--color-gray-200);
  box-shadow: inset 0 0 0 1px var(--color-gray-200);
  user-select: none;

  &[data-orientation='vertical'] {
    width: 0.25rem;
    height: 100%;
  }
`;

const Indicator = styled(BaseSlider.Indicator, forwardRef)`
  border-radius: 0.25rem;
  background-color: var(--color-gray-700);
  user-select: none;
`;

const Thumb = styled(BaseSlider.Thumb, forwardRef)`
  width: 1rem;
  height: 1rem;
  border-radius: 100%;
  background-color: white;
  outline: 1px solid var(--color-gray-300);
  user-select: none;

  &:has(:focus-visible) {
    outline: 2px solid var(--color-blue);
  }
`;

export const Slider = {
  ...BaseSlider,
  Control,
  Indicator,
  Thumb,
  Track,
};
