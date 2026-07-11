/**
 * Button — styled wrapper around `@base-ui/react/button`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation example:
 * https://base-ui.com/react/components/button
 *
 * Unlike most Base UI components, Button is a single element (not a namespace of
 * parts), so this module exports the styled component directly.
 */
import { Button as BaseButton } from '@base-ui/react/button';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

export const Button = styled(BaseButton, forwardRef)`
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
