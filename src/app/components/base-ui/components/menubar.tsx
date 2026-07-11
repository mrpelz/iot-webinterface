/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Menubar — styled wrapper around `@base-ui/react/menubar`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation example:
 * https://base-ui.com/react/components/menubar
 *
 * A Menubar composes `Menu` parts, but its triggers and popups are styled a bit
 * differently (transparent, borderless triggers). This module exports the
 * styled `Menubar` root plus menubar-tuned menu subparts as
 * `Menubar.MenuTrigger`, `Menubar.MenuPositioner`, `Menubar.MenuPopup`,
 * `Menubar.MenuItem`, `Menubar.SubmenuTrigger`, `Menubar.MenuSeparator`, and a
 * `Menubar.CaretRightIcon` helper. Use these together with `Menu.Root`,
 * `Menu.Portal`, and `Menu.SubmenuRoot` from the `Menu` export.
 */

import { Menu as BaseMenu } from '@base-ui/react/menu';
import { Menubar as BaseMenubar } from '@base-ui/react/menubar';
import { css, styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { bindComponent } from '../../../util/combine-components.js';

const Root = styled(BaseMenubar, forwardRef)`
  display: flex;
  align-items: center;
`;

const MenuTrigger = styled(BaseMenu.Trigger, forwardRef)`
  height: 2rem;
  box-sizing: border-box;
  padding: 0 0.75rem;
  border: 0;
  margin: 0;
  background-color: transparent;
  color: oklch(14.5% 0 0deg);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
  user-select: none;

  @media (prefers-color-scheme: dark) {
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
    position: relative;
    outline: 2px solid oklch(14.5% 0 0deg);
    outline-offset: -1px;

    @media (prefers-color-scheme: dark) {
      background-color: oklch(26.9% 0 0deg);
      outline-color: white;
    }
  }

  &:active:not([data-disabled]) {
    background-color: oklch(92.2% 0 0deg);

    @media (prefers-color-scheme: dark) {
      background-color: oklch(37.1% 0 0deg);
    }
  }

  &[data-pressed],
  &[data-popup-open] {
    background-color: oklch(97% 0 0deg);

    @media (prefers-color-scheme: dark) {
      background-color: oklch(26.9% 0 0deg);
    }
  }

  &[data-disabled] {
    color: oklch(55.6% 0 0deg);

    @media (prefers-color-scheme: dark) {
      color: oklch(70.8% 0 0deg);
    }
  }
`;

const MenuPositioner = styled(BaseMenu.Positioner, forwardRef)`
  outline: 0;
`;

const MenuPopup = styled(BaseMenu.Popup, forwardRef)`
  box-sizing: border-box;
  border: 1px solid oklch(14.5% 0 0deg);
  background-color: white;
  box-shadow: 0.25rem 0.25rem 0 rgb(0 0 0 / 12%);
  color: oklch(14.5% 0 0deg);
  outline: 0;
  padding-block: 0.25rem;
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

  &[data-instant] {
    transition: none;
  }
`;

const menubarItem = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 1rem;
  padding-left: 1rem;
  cursor: default;
  font-size: 0.875rem;
  font-weight: 400;
  gap: 1rem;
  line-height: 1rem;
  outline: 0;
  padding-block: 0.5rem;
  user-select: none;

  &[data-popup-open] {
    position: relative;
    z-index: 0;
  }

  &[data-highlighted] {
    position: relative;
    z-index: 0;
    color: white;

    @media (prefers-color-scheme: dark) {
      color: oklch(14.5% 0 0deg);
    }
  }

  &[data-popup-open]::before,
  &[data-highlighted]::before {
    position: absolute;
    z-index: -1;
    content: '';
    inset-block: 0;
    inset-inline: 0.25rem;
  }

  &[data-popup-open]::before {
    background-color: oklch(97% 0 0deg);

    @media (prefers-color-scheme: dark) {
      background-color: oklch(26.9% 0 0deg);
    }
  }

  &[data-highlighted]::before {
    background-color: oklch(14.5% 0 0deg);

    @media (prefers-color-scheme: dark) {
      background-color: white;
    }
  }

  &[data-highlighted][data-popup-open]::before {
    background-color: oklch(14.5% 0 0deg);

    @media (prefers-color-scheme: dark) {
      background-color: white;
    }
  }
`;

const MenuItem = bindComponent(BaseMenu.Item, { className: menubarItem });

const SubmenuTrigger = styled(
  bindComponent(BaseMenu.SubmenuTrigger, { className: menubarItem }),
  forwardRef,
)`
  padding-right: 0.5rem;
`;

const MenuSeparator = styled(BaseMenu.Separator, forwardRef)`
  height: 1px;
  margin: 0.25rem;
  background-color: oklch(14.5% 0 0deg);

  @media (prefers-color-scheme: dark) {
    background-color: white;
  }
`;

const CaretRightIcon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  (props, ref) => (
    <svg
      ref={ref}
      fill="currentColor"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      {...props}
      style={{
        display: 'block',
        ...(typeof props.style === 'object' && props.style),
      }}
    >
      <path d="M6 12V4l4.5 4z" />
    </svg>
  ),
);

export const Menubar = Object.assign(Root, {
  CaretRightIcon,
  MenuItem,
  MenuPopup,
  MenuPositioner,
  MenuSeparator,
  MenuTrigger,
  SubmenuTrigger,
});
