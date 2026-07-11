/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Tooltip — styled wrapper around `@base-ui/react/tooltip`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation example
 * (the primary demo at the top of the page):
 * https://base-ui.com/react/components/tooltip
 *
 * `Trigger` uses the example's `.Button` icon-button style. `Tooltip.Panel`
 * re-exports the example's toolbar-style wrapper. Provider/Portal/Viewport pass
 * through from Base UI.
 */
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

/** Bordered wrapper grouping several tooltip triggers (from the example). */
const Panel = styled('div', forwardRef)`
  display: flex;
  border: 1px solid oklch(14.5% 0 0deg);
  background-color: white;

  @media (prefers-color-scheme: dark) {
    border: 1px solid white;
    background-color: oklch(14.5% 0 0deg);
  }
`;

const Trigger = styled(BaseTooltip.Trigger, forwardRef)`
  display: flex;
  width: 2rem;
  height: 2rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  margin: 0;
  background-color: transparent;
  color: oklch(14.5% 0 0deg);
  user-select: none;

  @media (prefers-color-scheme: dark) {
    color: white;
  }

  &[data-popup-open] {
    background-color: oklch(97% 0 0deg);

    @media (prefers-color-scheme: dark) {
      background-color: oklch(26.9% 0 0deg);
    }
  }

  @media (hover: hover) {
    &:hover:not([data-disabled]) {
      background-color: oklch(97% 0 0deg);

      @media (prefers-color-scheme: dark) {
        background-color: oklch(26.9% 0 0deg);
      }
    }
  }

  &:focus-visible {
    position: relative;
    z-index: 1;
    background-color: transparent;
    outline: 2px solid oklch(14.5% 0 0deg);

    @media (prefers-color-scheme: dark) {
      outline-color: white;
    }
  }

  &:active:not([data-disabled]) {
    background-color: oklch(92.2% 0 0deg);

    @media (prefers-color-scheme: dark) {
      background-color: oklch(37.1% 0 0deg);
    }
  }
`;

const Popup = styled(BaseTooltip.Popup, forwardRef)`
  position: relative;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  padding: 0.25rem 0.5rem;
  border: 1px solid oklch(14.5% 0 0deg);
  background-color: white;
  box-shadow: 0.25rem 0.25rem 0 rgb(0 0 0 / 12%);
  color: oklch(14.5% 0 0deg);
  font-size: 0.875rem;
  line-height: 1.25rem;
  transform-origin: var(--transform-origin);
  transition:
    scale 100ms ease-out,
    opacity 100ms ease-out;

  @media (prefers-color-scheme: dark) {
    border: 1px solid white;
    background-color: oklch(14.5% 0 0deg);
    box-shadow: none;
    color: white;
  }

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    scale: 0.98;
  }

  &[data-instant] {
    transition: none;
  }
`;

const Arrow = styled(BaseTooltip.Arrow, forwardRef)`
  position: relative;
  display: block;
  overflow: clip;
  width: 12px;
  height: 6px;

  &[data-side='top'] {
    bottom: -6px;
    rotate: 180deg;
  }

  &[data-side='bottom'] {
    top: -6px;
    rotate: 0deg;
  }

  &[data-side='left'] {
    right: -9px;
    rotate: 90deg;
  }

  &[data-side='right'] {
    left: -9px;
    rotate: -90deg;
  }

  &::before {
    position: absolute;
    bottom: 0;
    left: 50%;
    display: block;
    width: calc(6px * sqrt(2));
    height: calc(6px * sqrt(2));
    box-sizing: border-box;
    border: 1px solid oklch(14.5% 0 0deg);
    background-color: white;
    content: '';
    transform: translate(-50%, 50%) rotate(45deg);

    @media (prefers-color-scheme: dark) {
      border: 1px solid white;
      background-color: oklch(14.5% 0 0deg);
    }
  }
`;

export const Tooltip = {
  ...BaseTooltip,
  Arrow,
  Panel,
  Popup,
  Trigger,
};
