/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Switch — styled wrapper around `@base-ui/react/switch`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation example:
 * https://base-ui.com/react/components/switch
 *
 * The example references docs-global CSS variables (`--color-gray-*`,
 * `--color-blue`) — see `theme.css` in this library for equivalents. The
 * enclosing `<label>` style (`.Label`) is re-exported as `Switch.Label`.
 */
import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

/** Enclosing label used to give the switch an accessible name. */
const Label = styled('label', forwardRef)`
  display: flex;
  align-items: center;
  color: var(--color-gray-900);
  font-size: 1rem;
  gap: 0.5rem;
  line-height: 1.5rem;
`;

const Root = styled(BaseSwitch.Root, forwardRef)`
  position: relative;
  display: flex;
  width: 2.5rem;
  height: 1.5rem;
  box-sizing: border-box;
  padding: 1px;
  border: 0;
  border-radius: 1.5rem;
  margin: 0;
  appearance: none;
  background-color: transparent;
  background-image: linear-gradient(
    to right,
    var(--color-gray-700) 35%,
    var(--color-gray-200) 65%
  );
  background-position-x: 100%;
  background-repeat: no-repeat;
  background-size: 6.5rem 100%;
  outline: 1px solid;
  outline-offset: -1px;
  transition-duration: 125ms;
  transition-property: background-position, box-shadow;
  transition-timing-function: cubic-bezier(0.26, 0.75, 0.38, 0.45);

  &:active {
    background-color: var(--color-gray-100);
  }

  &[data-checked] {
    background-position-x: 0%;
  }

  &[data-checked]:active {
    background-color: var(--color-gray-500);
  }

  @media (prefers-color-scheme: light) {
    box-shadow: var(--color-gray-200) 0 1.5px 2px inset;
    outline-color: var(--color-gray-200);
  }

  @media (prefers-color-scheme: dark) {
    background-image: linear-gradient(
      to right,
      var(--color-gray-500) 35%,
      var(--color-gray-200) 65%
    );
    box-shadow: rgb(0 0 0 / 75%) 0 1.5px 2px inset;
    outline-color: rgb(255 255 255 / 15%);

    &[data-checked] {
      box-shadow: none;
    }
  }

  &:focus-visible {
    &::before {
      position: absolute;
      border-radius: inherit;
      content: '';
      inset: 0;
      outline: 2px solid var(--color-blue);
      outline-offset: 2px;
    }
  }
`;

const Thumb = styled(BaseSwitch.Thumb, forwardRef)`
  height: 100%;
  border-radius: 100%;
  aspect-ratio: 1 / 1;
  background-color: white;
  transition: translate 150ms ease;

  &[data-checked] {
    translate: 1rem 0;
  }

  @media (prefers-color-scheme: light) {
    box-shadow:
      0 0 1px 1px var(--color-gray-100),
      0 1px 1px var(--color-gray-100),
      1px 2px 4px -1px var(--color-gray-100);
  }

  @media (prefers-color-scheme: dark) {
    box-shadow:
      0 0 1px 1px rgb(0 0 0 / 25%),
      0 1px 1px rgb(0 0 0 / 25%),
      1px 2px 4px -1px rgb(0 0 0 / 25%);
  }
`;

export const Switch = {
  ...BaseSwitch,
  Label,
  Root,
  Thumb,
};
