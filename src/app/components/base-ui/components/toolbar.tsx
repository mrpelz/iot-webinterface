/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Toolbar — styled wrapper around `@base-ui/react/toolbar`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation example:
 * https://base-ui.com/react/components/toolbar
 *
 * The example also composes a `Select` (whose parts are styled in `Select.tsx`).
 * `Toolbar.Input` has no dedicated CSS in the example and passes through.
 */
import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Root = styled(BaseToolbar.Root, forwardRef)`
  display: flex;
  width: 37.5rem;
  box-sizing: border-box;
  align-items: center;
  padding: 1px;
  border: 1px solid oklch(14.5% 0 0deg);
  background-color: white;
  gap: 1px;

  @media (prefers-color-scheme: dark) {
    border: 1px solid white;
    background-color: oklch(14.5% 0 0deg);
  }
`;

const Group = styled(BaseToolbar.Group, forwardRef)`
  display: flex;
`;

const Button = styled(BaseToolbar.Button, forwardRef)`
  display: flex;
  min-width: 2rem;
  height: 2rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  margin: 0;
  background-color: transparent;
  color: oklch(14.5% 0 0deg);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 400;
  gap: 0.5rem;
  line-height: 1;
  user-select: none;
  white-space: nowrap;

  @media (prefers-color-scheme: dark) {
    color: white;
  }

  @media (hover: hover) {
    &:hover:not([data-disabled], [data-popup-open]) {
      background-color: oklch(97% 0 0deg);

      @media (prefers-color-scheme: dark) {
        background-color: oklch(26.9% 0 0deg);
      }
    }
  }

  &:focus-visible {
    outline: 2px solid oklch(14.5% 0 0deg);
    outline-offset: -2px;

    @media (prefers-color-scheme: dark) {
      outline-color: white;
    }
  }

  &:active:not([data-disabled], [data-pressed]) {
    background-color: oklch(92.2% 0 0deg);

    @media (prefers-color-scheme: dark) {
      background-color: oklch(37.1% 0 0deg);
    }
  }

  &[aria-pressed] {
    padding: 0 0.75rem;
  }

  &[data-pressed] {
    background-color: oklch(14.5% 0 0deg);
    color: white;

    @media (prefers-color-scheme: dark) {
      background-color: white;
      color: oklch(14.5% 0 0deg);
    }
  }

  @media (hover: hover) {
    &[data-pressed]:hover:not([data-disabled], [data-popup-open]) {
      background-color: oklch(14.5% 0 0deg);
      color: white;

      @media (prefers-color-scheme: dark) {
        background-color: white;
        color: oklch(14.5% 0 0deg);
      }
    }
  }

  &[data-popup-open] {
    background-color: oklch(97% 0 0deg);
    color: oklch(14.5% 0 0deg);

    @media (prefers-color-scheme: dark) {
      background-color: oklch(26.9% 0 0deg);
      color: white;
    }
  }

  &[role='combobox'] {
    min-width: 8rem;
    justify-content: space-between;
    padding: 0 0.5rem;
  }
`;

const Separator = styled(BaseToolbar.Separator, forwardRef)`
  width: 1px;
  height: 16px;
  margin: 0.25rem;
  background-color: oklch(14.5% 0 0deg);

  @media (prefers-color-scheme: dark) {
    background-color: white;
  }
`;

const Link = styled(BaseToolbar.Link, forwardRef)`
  flex: 0 0 auto;
  align-self: center;
  color: oklch(55.6% 0 0deg);
  font-family: inherit;
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin-inline: auto 0.875rem;
  text-decoration: none;

  @media (prefers-color-scheme: dark) {
    color: oklch(70.8% 0 0deg);
  }

  @media (hover: hover) {
    &:hover {
      color: oklch(48.8% 0.243 264.376deg);

      @media (prefers-color-scheme: dark) {
        color: oklch(62.3% 0.214 259.815deg);
      }
    }
  }

  &:focus-visible {
    outline: 2px solid oklch(14.5% 0 0deg);

    @media (prefers-color-scheme: dark) {
      outline-color: white;
    }
  }
`;

export const Toolbar = {
  ...BaseToolbar,
  Button,
  Group,
  Link,
  Root,
  Separator,
};
