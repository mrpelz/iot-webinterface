/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Drawer — styled wrapper around `@base-ui/react/drawer`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation example
 * (the primary right-side drawer demo):
 * https://base-ui.com/react/components/drawer
 *
 * Drawer extends Dialog with swipe gestures, snap points, and indent effects.
 * `Trigger`/`Close` use the example's `.Button` style. The `.Actions` helper is
 * re-exported as `Drawer.Actions`. Parts used only in advanced demos
 * (Provider, Indent, IndentBackground, SwipeArea) pass through from Base UI;
 * position/snap/indent styling is driven by your own CSS, as in the docs.
 */
import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { css, styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { bindComponent } from '../../../util/combine-components.js';

const buttonStyles = css`
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
    &:hover:not([data-disabled]) {
      background-color: oklch(97% 0 0deg);

      @media (prefers-color-scheme: dark) {
        background-color: oklch(26.9% 0 0deg);
      }
    }
  }

  &:focus-visible {
    outline: 2px solid oklch(14.5% 0 0deg);
    outline-offset: -1px;

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

  &[data-disabled] {
    border-color: oklch(55.6% 0 0deg);
    color: oklch(55.6% 0 0deg);

    @media (prefers-color-scheme: dark) {
      border-color: oklch(70.8% 0 0deg);
      color: oklch(70.8% 0 0deg);
    }
  }
`;

const Trigger = bindComponent(BaseDrawer.Trigger, { className: buttonStyles });

const Close = bindComponent(BaseDrawer.Close, { className: buttonStyles });

const Backdrop = styled(BaseDrawer.Backdrop, forwardRef)`
  --backdrop-opacity: 0.2;
  --bleed: 3rem;

  position: fixed;
  min-height: 100dvh;
  background-color: black;
  inset: 0;
  opacity: calc(var(--backdrop-opacity) * (1 - var(--drawer-swipe-progress)));
  transition-duration: 450ms;
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.32, 0.72, 0, 1);

  /* iOS 26+: Ensure the backdrop covers the entire visible viewport. */
  @supports (-webkit-touch-callout: none) {
    position: absolute;
  }

  @media (prefers-color-scheme: dark) {
    --backdrop-opacity: 0.7;
  }

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
  }

  &[data-swiping] {
    transition-duration: 0ms;
  }

  &[data-ending-style] {
    transition-duration: calc(var(--drawer-swipe-strength) * 400ms);
  }
`;

const Viewport = styled(BaseDrawer.Viewport, forwardRef)`
  --viewport-padding: 0px;

  position: fixed;
  display: flex;
  justify-content: flex-end;
  padding: var(--viewport-padding);
  inset: 0;

  @supports (-webkit-touch-callout: none) {
    --viewport-padding: 0.625rem;
  }
`;

const Popup = styled(BaseDrawer.Popup, forwardRef)`
  --bleed: 3rem;

  width: calc(20rem + var(--bleed));
  max-width: calc(100vw - 3rem + var(--bleed));
  height: 100%;
  box-sizing: border-box;
  padding: 1.5rem;
  padding-right: calc(1.5rem + var(--bleed));
  border-left: 1px solid oklch(14.5% 0 0deg);
  margin-right: calc(-1 * var(--bleed));
  background-color: white;
  box-shadow: 0.25rem 0.25rem 0 rgb(0 0 0 / 12%);
  color: oklch(14.5% 0 0deg);
  outline: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  touch-action: auto;
  transform: translateX(var(--drawer-swipe-movement-x));
  transition: transform 450ms cubic-bezier(0.32, 0.72, 0, 1);
  will-change: transform;

  @media (prefers-color-scheme: dark) {
    border-left: 1px solid white;
    background-color: oklch(14.5% 0 0deg);
    box-shadow: none;
    color: white;
  }

  &[data-swiping] {
    user-select: none;
  }

  &[data-starting-style],
  &[data-ending-style] {
    transform: translateX(
      calc(100% - var(--bleed) + var(--viewport-padding) + 2px)
    );
  }

  &[data-ending-style] {
    transition-duration: calc(var(--drawer-swipe-strength) * 400ms);
  }

  @supports (-webkit-touch-callout: none) {
    --bleed: 0px;

    border: 1px solid oklch(14.5% 0 0deg);
    margin-right: 0;

    @media (prefers-color-scheme: dark) {
      border: 1px solid white;
    }
  }
`;

const Content = styled(BaseDrawer.Content, forwardRef)`
  width: 100%;
  max-width: 32rem;
  margin: 0 auto;
`;

const Title = styled(BaseDrawer.Title, forwardRef)`
  margin-top: 0;
  margin-bottom: 0.25rem;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5rem;
`;

const Description = styled(BaseDrawer.Description, forwardRef)`
  margin: 0 0 1.5rem;
  color: oklch(43.9% 0 0deg);
  font-size: 0.875rem;
  line-height: 1.25rem;

  @media (prefers-color-scheme: dark) {
    color: oklch(70.8% 0 0deg);
  }
`;

/** Right-aligned row for the drawer's action buttons. */
const Actions = styled('div', forwardRef)`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

export const Drawer = {
  ...BaseDrawer,
  Actions,
  Backdrop,
  Close,
  Content,
  Description,
  Popup,
  Title,
  Trigger,
  Viewport,
};
