/* eslint-disable @typescript-eslint/naming-convention */
/**
 * PreviewCard — styled wrapper around `@base-ui/react/preview-card`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation example:
 * https://base-ui.com/react/components/preview-card
 *
 * `Trigger` uses the example's `.Link` style. Layout helpers from the example
 * are re-exported: `PreviewCard.Paragraph`, `PreviewCard.Content`
 * (`.PopupContent`), `PreviewCard.Image`, and `PreviewCard.Summary`.
 */
import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Trigger = styled(BasePreviewCard.Trigger, forwardRef)`
  color: oklch(14.5% 0 0deg);
  outline: 0;
  text-decoration-color: color-mix(
    in oklab,
    oklch(14.5% 0 0deg),
    transparent 40%
  );
  text-decoration-line: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;

  @media (prefers-color-scheme: dark) {
    color: white;
    text-decoration-color: color-mix(in oklab, white, transparent 40%);
  }

  @media (hover: hover) {
    &:hover {
      text-decoration-color: oklch(14.5% 0 0deg);

      @media (prefers-color-scheme: dark) {
        text-decoration-color: white;
      }
    }
  }

  &[data-popup-open] {
    text-decoration-color: oklch(14.5% 0 0deg);

    @media (prefers-color-scheme: dark) {
      text-decoration-color: white;
    }
  }

  &:focus-visible {
    outline: 2px solid oklch(14.5% 0 0deg);
    text-decoration-line: none;

    @media (prefers-color-scheme: dark) {
      outline-color: white;
    }
  }
`;

const Positioner = styled(BasePreviewCard.Positioner, forwardRef)`
  width: var(--positioner-width);
  max-width: var(--available-width);
  height: var(--positioner-height);
`;

const Popup = styled(BasePreviewCard.Popup, forwardRef)`
  position: relative;
  width: var(--popup-width, auto);
  height: var(--popup-height, auto);
  box-sizing: border-box;
  border: 1px solid oklch(14.5% 0 0deg);
  background-color: white;
  box-shadow: 0.25rem 0.25rem 0 rgb(0 0 0 / 12%);
  color: oklch(14.5% 0 0deg);
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

const Arrow = styled(BasePreviewCard.Arrow, forwardRef)`
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

/** Enclosing paragraph that hosts the trigger link (from the example). */
const Paragraph = styled('p', forwardRef)`
  margin: 0;
  color: oklch(14.5% 0 0deg);
  font-size: 1rem;
  line-height: 1.5rem;
  text-wrap: balance;

  @media (prefers-color-scheme: dark) {
    color: white;
  }
`;

/** Inner content wrapper for the popup (`.PopupContent`). */
const Content = styled('div', forwardRef)`
  display: flex;
  width: min-content;
  box-sizing: border-box;
  flex-direction: column;
  padding: 0.5rem;
  gap: 0.5rem;
`;

const Image = styled('img', forwardRef)`
  display: block;
  max-width: none;
`;

const Summary = styled('p', forwardRef)`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.25rem;
  text-wrap: pretty;
`;

export const PreviewCard = {
  ...BasePreviewCard,
  Arrow,
  Content,
  Image,
  Paragraph,
  Popup,
  Positioner,
  Summary,
  Trigger,
};
