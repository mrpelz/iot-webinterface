/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Dialog — styled wrapper around `@base-ui/react/dialog`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation example
 * (the primary demo at the top of the page):
 * https://base-ui.com/react/components/dialog
 *
 * Both `Trigger` and `Close` share the `.Button` style in the example, so it's
 * applied to both here. Layout helpers `Intro` (title + description) and
 * `Actions` (button row) are re-exported as `Dialog.Intro` / `Dialog.Actions`.
 */
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
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

const Trigger = bindComponent(BaseDialog.Trigger, { className: buttonStyles });

const Close = bindComponent(BaseDialog.Close, { className: buttonStyles });

const Backdrop = styled(BaseDialog.Backdrop, forwardRef)`
  position: fixed;
  min-height: 100dvh;
  background-color: black;
  inset: 0;
  opacity: 0.2;
  transition: opacity 150ms;

  /* iOS 26+: Ensure the backdrop covers the entire visible viewport. */
  @supports (-webkit-touch-callout: none) {
    position: absolute;
  }

  @media (prefers-color-scheme: dark) {
    opacity: 0.5;
  }

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
  }
`;

const Popup = styled(BaseDialog.Popup, forwardRef)`
  position: fixed;
  top: 50%;
  left: 50%;
  display: flex;
  width: 24rem;
  max-width: calc(100vw - 3rem);
  box-sizing: border-box;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid oklch(14.5% 0 0deg);
  margin-top: -2rem;
  background-color: white;
  box-shadow: 0.25rem 0.25rem 0 rgb(0 0 0 / 12%);
  color: oklch(14.5% 0 0deg);
  gap: 1rem;
  transform: translate(-50%, -50%);
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
    transform: translate(-50%, -50%) scale(0.98);
  }
`;

/** Groups the title and description with a small gap. */
const Intro = styled('div', forwardRef)`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Title = styled(BaseDialog.Title, forwardRef)`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5rem;
`;

const Description = styled(BaseDialog.Description, forwardRef)`
  margin: 0;
  color: oklch(43.9% 0 0deg);
  font-size: 0.875rem;
  line-height: 1.25rem;

  @media (prefers-color-scheme: dark) {
    color: oklch(70.8% 0 0deg);
  }
`;

/** Right-aligned row for the action buttons. */
const Actions = styled('div', forwardRef)`
  display: flex;
  justify-content: end;
  gap: 0.75rem;
`;

export const Dialog = {
  ...BaseDialog,
  Actions,
  Backdrop,
  Close,
  Description,
  Intro,
  Popup,
  Title,
  Trigger,
};
