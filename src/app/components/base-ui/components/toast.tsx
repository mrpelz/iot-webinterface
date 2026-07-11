/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Toast — styled wrapper around `@base-ui/react/toast`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation examples
 * (primary bottom-right stacked demo, plus the `data-type` success/error
 * coloring from the promise demo):
 * https://base-ui.com/react/components/toast
 *
 * The example's layout helpers are re-exported as `Toast.Text` (the flex column
 * holding title + description) and `Toast.Button` (the trigger button style).
 * Provider/Portal/Positioner/Action/Arrow and the `useToastManager` /
 * `createToastManager` helpers pass through from Base UI unchanged.
 */
import { Toast as BaseToast } from '@base-ui/react/toast';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Viewport = styled(BaseToast.Viewport, forwardRef)`
  position: fixed;
  z-index: 1;
  width: calc(100vw - 2rem);
  margin: 0 auto;
  inset: auto 1rem 1rem auto;

  @media (width >= 500px) {
    right: 2rem;
    bottom: 2rem;
    width: 22.5rem;
  }
`;

const Root = styled(BaseToast.Root, forwardRef)`
  --gap: 0.75rem;
  --peek: 0.75rem;
  --scale: calc(max(0, 1 - (var(--toast-index) * 0.1)));
  --shrink: calc(1 - var(--scale));
  --height: var(--toast-frontmost-height, var(--toast-height));
  --offset-y: calc(
    var(--toast-offset-y) * -1 + (var(--toast-index) * var(--gap) * -1) +
      var(--toast-swipe-movement-y)
  );

  position: absolute;
  z-index: calc(1000 - var(--toast-index));
  right: 0;
  bottom: 0;
  left: auto;
  width: 100%;
  height: var(--height);
  box-sizing: border-box;
  border: 1px solid oklch(14.5% 0 0deg);
  margin: 0 auto;
  margin-right: 0;
  background-color: white;
  box-shadow: 0.25rem 0.25rem 0 rgb(0 0 0 / 12%);
  color: oklch(14.5% 0 0deg);
  cursor: default;
  transform: translateX(var(--toast-swipe-movement-x))
    translateY(
      calc(
        var(--toast-swipe-movement-y) - (var(--toast-index) * var(--peek)) -
          (var(--shrink) * var(--height))
      )
    )
    scale(var(--scale));
  transform-origin: bottom center;
  transition:
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.5s,
    height 0.15s;
  user-select: none;

  @media (prefers-color-scheme: dark) {
    border: 1px solid white;
    background-color: oklch(14.5% 0 0deg);
    box-shadow: none;
    color: white;
  }

  &[data-expanded] {
    height: var(--toast-height);
    transform: translateX(var(--toast-swipe-movement-x))
      translateY(var(--offset-y));
  }

  &[data-starting-style],
  &[data-ending-style] {
    transform: translateY(150%);
  }

  &[data-limited] {
    opacity: 0;
  }

  &[data-ending-style] {
    opacity: 0;

    &[data-swipe-direction='up'] {
      transform: translateY(calc(var(--toast-swipe-movement-y) - 150%));
    }

    &[data-swipe-direction='left'] {
      transform: translateX(calc(var(--toast-swipe-movement-x) - 150%))
        translateY(var(--offset-y));
    }

    &[data-swipe-direction='right'] {
      transform: translateX(calc(var(--toast-swipe-movement-x) + 150%))
        translateY(var(--offset-y));
    }

    &[data-swipe-direction='down'] {
      transform: translateY(calc(var(--toast-swipe-movement-y) + 150%));
    }
  }

  &::after {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    height: calc(var(--gap) + 1px);
    content: '';
  }

  /* Success / error typing from the promise demo. */
  &[data-type='success'] > * {
    /* Color applied to Text below via component targeting. */
  }

  &:focus-visible {
    outline: 2px solid oklch(14.5% 0 0deg);
    outline-offset: -1px;

    @media (prefers-color-scheme: dark) {
      outline-color: white;
    }
  }
`;

const Content = styled(BaseToast.Content, forwardRef)`
  display: flex;
  overflow: hidden;
  height: 100%;
  box-sizing: border-box;
  align-items: center;
  padding: 0.75rem;
  gap: 1rem;
  transition: opacity 0.25s cubic-bezier(0.22, 1, 0.36, 1);

  &[data-behind] {
    opacity: 0;
  }

  &[data-expanded] {
    opacity: 1;
  }
`;

/** Flex column wrapping the title + description (`.Text` in the example). */
const Text = styled('div', forwardRef)`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 0.25rem;

  /* Success / error typing colors (from the promise demo). */
  [data-type='success'] & {
    color: oklch(52.7% 0.154 150.069deg);

    @media (prefers-color-scheme: dark) {
      color: oklch(79.2% 0.209 151.711deg);
    }
  }

  [data-type='error'] & {
    color: oklch(50.5% 0.213 27.518deg);

    @media (prefers-color-scheme: dark) {
      color: oklch(70.4% 0.191 22.216deg);
    }
  }
`;

const Title = styled(BaseToast.Title, forwardRef)`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.25rem;
`;

const Description = styled(BaseToast.Description, forwardRef)`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.25rem;
`;

const Close = styled(BaseToast.Close, forwardRef)`
  display: flex;
  height: 2rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 0 0.75rem;
  border: 1px solid oklch(14.5% 0 0deg);
  border-radius: 0;
  background-color: white;
  color: oklch(14.5% 0 0deg);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 400;
  gap: 0.5rem;
  line-height: 1;
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

/** Trigger button style used in the demos to create toasts. */
const Button = styled('button', forwardRef)`
  display: flex;
  height: 2rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0 0.75rem;
  border: 1px solid oklch(14.5% 0 0deg);
  border-radius: 0;
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
    &:hover {
      background-color: oklch(97% 0 0deg);

      @media (prefers-color-scheme: dark) {
        background-color: oklch(26.9% 0 0deg);
      }
    }
  }

  &:active {
    background-color: oklch(92.2% 0 0deg);

    @media (prefers-color-scheme: dark) {
      background-color: oklch(37.1% 0 0deg);
    }
  }

  &:focus-visible {
    outline: 2px solid oklch(14.5% 0 0deg);
    outline-offset: -1px;

    @media (prefers-color-scheme: dark) {
      outline-color: white;
    }
  }
`;

export const Toast = {
  ...BaseToast,
  Button,
  Close,
  Content,
  Description,
  Root,
  Text,
  Title,
  Viewport,
};
