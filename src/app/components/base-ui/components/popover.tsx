/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Popover — styled wrapper around `@base-ui/react/popover`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation example
 * (the primary demo at the top of the page):
 * https://base-ui.com/react/components/popover
 *
 * `Trigger` uses the example's `.Button` style. Parts without dedicated CSS in
 * the example (Portal, Backdrop, Viewport, Close) pass through from Base UI.
 */
import { Popover as BasePopover } from '@base-ui/react/popover';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Trigger = styled(BasePopover.Trigger, forwardRef)`
  display: flex;
  height: 2rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0 0.75rem;
  border: 1px solid oklch(14.5% 0 0deg);
  margin: 0;
  background-color: white;
  color: oklch(14.5% 0 0deg);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 400;
  gap: 0.5rem;
  line-height: 1;
  user-select: none;
  white-space: nowrap;

  @media (prefers-color-scheme: dark) {
    border: 1px solid white;
    background-color: oklch(14.5% 0 0deg);
    color: white;
  }

  @media (hover: hover) {
    &:hover:not([data-disabled], :disabled) {
      background-color: oklch(97% 0 0deg);

      @media (prefers-color-scheme: dark) {
        background-color: oklch(26.9% 0 0deg);
      }
    }
  }

  &[data-disabled],
  &:disabled {
    border-color: oklch(55.6% 0 0deg);
    color: oklch(55.6% 0 0deg);

    @media (prefers-color-scheme: dark) {
      border-color: oklch(70.8% 0 0deg);
      color: oklch(70.8% 0 0deg);
    }
  }

  &:focus-visible {
    outline: 2px solid oklch(14.5% 0 0deg);
    outline-offset: -1px;

    @media (prefers-color-scheme: dark) {
      outline-color: white;
    }
  }

  &:active:not([data-disabled], :disabled) {
    background-color: oklch(92.2% 0 0deg);

    @media (prefers-color-scheme: dark) {
      background-color: oklch(37.1% 0 0deg);
    }
  }

  &[data-popup-open]:not([data-disabled], :disabled) {
    background-color: oklch(97% 0 0deg);

    @media (prefers-color-scheme: dark) {
      background-color: oklch(26.9% 0 0deg);
    }
  }
`;

const Positioner = styled(BasePopover.Positioner, forwardRef)`
  width: var(--positioner-width);
  max-width: var(--available-width);
  height: var(--positioner-height);
`;

const Popup = styled(BasePopover.Popup, forwardRef)`
  position: relative;
  display: flex;
  width: var(--popup-width, auto);
  max-width: 500px;
  height: var(--popup-height, auto);
  box-sizing: border-box;
  flex-direction: column;
  padding: 0.75rem;
  border: 1px solid oklch(14.5% 0 0deg);
  background-color: white;
  box-shadow: 0.25rem 0.25rem 0 rgb(0 0 0 / 12%);
  color: oklch(14.5% 0 0deg);
  gap: 0.25rem;
  outline: none;
  transform-origin: var(--transform-origin);
  transition:
    transform 100ms ease-out,
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
    transform: scale(0.98);
  }
`;

const Arrow = styled(BasePopover.Arrow, forwardRef)`
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

const Title = styled(BasePopover.Title, forwardRef)`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.25rem;
`;

const Description = styled(BasePopover.Description, forwardRef)`
  margin: 0;
  color: oklch(43.9% 0 0deg);
  font-size: 0.875rem;
  line-height: 1.25rem;

  @media (prefers-color-scheme: dark) {
    color: oklch(70.8% 0 0deg);
  }
`;

export const Popover = {
  ...BasePopover,
  Arrow,
  Description,
  Popup,
  Positioner,
  Title,
  Trigger,
};
