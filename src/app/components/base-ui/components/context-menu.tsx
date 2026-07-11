/* eslint-disable @typescript-eslint/naming-convention */
/**
 * ContextMenu — styled wrapper around `@base-ui/react/context-menu`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation examples:
 * https://base-ui.com/react/components/context-menu
 *
 * References docs-global CSS variables (`--color-gray-*`) and the `canvas`
 * system color; see `theme.css`. The `SubmenuPopup` (scale-in) variant and the
 * arrow parts from the nested-menu demo are re-exported. Parts without
 * dedicated CSS (Portal, Backdrop, Group, GroupLabel, RadioGroup, indicators)
 * pass through from Base UI. A `ContextMenu.ChevronRightIcon` helper is
 * included for submenu triggers.
 */

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import { css, styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { bindComponent } from '../../../util/combine-components.js';

const Trigger = styled(BaseContextMenu.Trigger, forwardRef)`
  display: flex;
  width: 15rem;
  height: 12rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-gray-300);
  border-radius: 0.375rem;
  color: var(--color-gray-900);
  font-weight: 400;
  user-select: none;
`;

const Positioner = styled(BaseContextMenu.Positioner, forwardRef)`
  outline: 0;
`;

const popupStyles = css`
  box-sizing: border-box;
  border-radius: 0.375rem;
  background-color: canvas;
  color: var(--color-gray-900);
  padding-block: 0.25rem;
  transform-origin: var(--transform-origin);
  transition:
    transform 150ms,
    opacity 150ms;

  &[data-ending-style] {
    opacity: 0;
  }

  @media (prefers-color-scheme: light) {
    box-shadow:
      0 10px 15px -3px var(--color-gray-200),
      0 4px 6px -4px var(--color-gray-200);
    outline: 1px solid var(--color-gray-200);
  }

  @media (prefers-color-scheme: dark) {
    outline: 1px solid var(--color-gray-300);
    outline-offset: -1px;
  }
`;

const Popup = bindComponent(BaseContextMenu.Popup, { className: popupStyles });

/** Popup variant used for submenus (adds a scale-in/out transition). */
const SubmenuPopup = styled(
  bindComponent(BaseContextMenu.Popup, { className: popupStyles }),
  forwardRef,
)`
  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    transform: scale(0.9);
  }
`;

const itemStyles = css`
  display: flex;
  padding-right: 2rem;
  padding-left: 1rem;
  cursor: default;
  font-size: 0.875rem;
  line-height: 1rem;
  outline: 0;
  padding-block: 0.5rem;
  user-select: none;

  &[data-popup-open] {
    position: relative;
    z-index: 0;
  }

  &[data-popup-open]::before {
    position: absolute;
    z-index: -1;
    border-radius: 0.25rem;
    background-color: var(--color-gray-100);
    content: '';
    inset-block: 0;
    inset-inline: 0.25rem;
  }

  &[data-highlighted] {
    position: relative;
    z-index: 0;
    color: var(--color-gray-50);
  }

  &[data-highlighted]::before {
    position: absolute;
    z-index: -1;
    border-radius: 0.25rem;
    background-color: var(--color-gray-900);
    content: '';
    inset-block: 0;
    inset-inline: 0.25rem;
  }
`;

const Item = bindComponent(BaseContextMenu.Item, { className: itemStyles });

const SubmenuTrigger = styled(
  bindComponent(BaseContextMenu.SubmenuTrigger, { className: itemStyles }),
  forwardRef,
)`
  align-items: center;
  justify-content: space-between;
  padding-right: 1rem;
  gap: 1rem;
`;

const Separator = styled(BaseContextMenu.Separator, forwardRef)`
  height: 1px;
  margin: 0.375rem 1rem;
  background-color: var(--color-gray-200);
`;

const Arrow = styled(BaseContextMenu.Arrow, forwardRef)`
  display: flex;

  &[data-side='top'] {
    bottom: -8px;
    rotate: 180deg;
  }

  &[data-side='bottom'] {
    top: -8px;
    rotate: 0deg;
  }

  &[data-side='left'] {
    right: -13px;
    rotate: 90deg;
  }

  &[data-side='right'] {
    left: -13px;
    rotate: -90deg;
  }
`;

const ChevronRightIcon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  (props, ref) => (
    <svg
      ref={ref}
      fill="none"
      height="10"
      viewBox="0 0 10 10"
      width="10"
      {...props}
    >
      <path
        d="M3.5 9L7.5 5L3.5 1"
        stroke="currentcolor"
        strokeWidth="1.5"
      />
    </svg>
  ),
);

export const ContextMenu = {
  ...BaseContextMenu,
  Arrow,
  ChevronRightIcon,
  Item,
  Popup,
  Positioner,
  Separator,
  SubmenuPopup,
  SubmenuTrigger,
  Trigger,
};
