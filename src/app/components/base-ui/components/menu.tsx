/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Menu — styled wrapper around `@base-ui/react/menu`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation examples:
 * https://base-ui.com/react/components/menu
 *
 * Covers the base menu plus checkbox items, radio items, group labels,
 * submenus, arrow, and the icon-button trigger variant. Helper icons from the
 * examples (CaretDownIcon, CaretRightIcon, CheckIcon) are re-exported.
 * Parts without dedicated CSS (Portal, Backdrop, Group, Viewport, LinkItem,
 * SubmenuRoot, RadioGroup) pass through from Base UI.
 */

import { mergeClassNames } from '@base-ui/react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { css, styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { bindComponent } from '../../../util/combine-components.js';

const triggerStyles = css`
  display: flex;
  height: 2rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0 0.5rem 0 0.75rem;
  border: 1px solid oklch(14.5% 0 0deg);
  border-radius: 0;
  margin: 0;
  background-color: white;
  color: oklch(14.5% 0 0deg);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 400;
  gap: 0.375rem;
  line-height: 1;
  outline: 0;
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

  &[data-popup-open] {
    background-color: oklch(97% 0 0deg);

    @media (prefers-color-scheme: dark) {
      background-color: oklch(26.9% 0 0deg);
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

const Trigger = bindComponent(BaseMenu.Trigger, { className: triggerStyles });

/** Square icon-button variant of the trigger (from the detached-triggers demo). */
const IconButton = styled(BaseMenu.Trigger, forwardRef)`
  display: flex;
  width: 2rem;
  height: 2rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid oklch(14.5% 0 0deg);
  border-radius: 0;
  margin: 0;
  background-color: white;
  color: oklch(14.5% 0 0deg);
  outline: 0;
  user-select: none;

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

  &[data-popup-open] {
    background-color: oklch(97% 0 0deg);

    @media (prefers-color-scheme: dark) {
      background-color: oklch(26.9% 0 0deg);
    }
  }
`;

const Positioner = styled(BaseMenu.Positioner, forwardRef)`
  outline: 0;
`;

const Popup = styled(BaseMenu.Popup, forwardRef)`
  position: relative;
  box-sizing: border-box;
  border: 1px solid oklch(14.5% 0 0deg);
  border-radius: 0;
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
`;

const itemHighlight = css`
  cursor: default;
  font-size: 0.875rem;
  line-height: 1rem;
  outline: 0;
  user-select: none;

  &[data-highlighted] {
    position: relative;
    z-index: 0;
    color: white;

    @media (prefers-color-scheme: dark) {
      color: oklch(14.5% 0 0deg);
    }
  }

  &[data-highlighted]::before {
    position: absolute;
    z-index: -1;
    background-color: oklch(14.5% 0 0deg);
    content: '';
    inset-block: 0;
    inset-inline: 0.25rem;

    @media (prefers-color-scheme: dark) {
      background-color: white;
    }
  }

  &[data-disabled] {
    color: oklch(55.6% 0 0deg);

    @media (prefers-color-scheme: dark) {
      color: oklch(70.8% 0 0deg);
    }
  }
`;

const Item = styled(
  bindComponent(BaseMenu.Item, { className: itemHighlight }),
  forwardRef,
)`
  display: flex;
  padding-right: 2rem;
  padding-left: 1rem;
  color: inherit;
  padding-block: 0.5rem;
`;

const LinkItem = styled(
  bindComponent(BaseMenu.LinkItem, { className: itemHighlight }),
  forwardRef,
)`
  display: flex;
  padding-right: 2rem;
  padding-left: 1rem;
  color: inherit;
  padding-block: 0.5rem;
  text-decoration: none;
`;

const SubmenuTrigger = styled(BaseMenu.SubmenuTrigger, forwardRef)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 0.5rem;
  padding-left: 1rem;
  cursor: default;
  font-size: 0.875rem;
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

  &[data-disabled] {
    color: oklch(55.6% 0 0deg);

    @media (prefers-color-scheme: dark) {
      color: oklch(70.8% 0 0deg);
    }
  }
`;

const gridItem = css`
  display: grid;
  align-items: center;
  padding-right: 2rem;
  padding-left: 0.625rem;
  gap: 0.5rem;
  grid-template-columns: 1rem 1fr;
  padding-block: 0.5rem;
`;

const CheckboxItem = bindComponent(BaseMenu.CheckboxItem, {
  className: mergeClassNames(itemHighlight, gridItem),
});

const RadioItem = bindComponent(BaseMenu.RadioItem, {
  className: mergeClassNames(itemHighlight, gridItem),
});

const CheckboxItemIndicator = styled(
  BaseMenu.CheckboxItemIndicator,
  forwardRef,
)`
  grid-column-start: 1;
`;

const RadioItemIndicator = styled(BaseMenu.RadioItemIndicator, forwardRef)`
  grid-column-start: 1;
`;

const GroupLabel = styled(BaseMenu.GroupLabel, forwardRef)`
  padding-right: 2rem;
  padding-left: 2.125rem;
  color: oklch(55.6% 0 0deg);
  font-size: 0.875rem;
  line-height: 1rem;
  padding-block: 0.5rem;
  user-select: none;

  @media (prefers-color-scheme: dark) {
    color: oklch(70.8% 0 0deg);
  }
`;

const Separator = styled(BaseMenu.Separator, forwardRef)`
  height: 1px;
  margin: 0.25rem;
  background-color: oklch(14.5% 0 0deg);

  @media (prefers-color-scheme: dark) {
    background-color: white;
  }
`;

const Arrow = styled(BaseMenu.Arrow, forwardRef)`
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

function svgIcon(path: React.ReactNode, fill = true) {
  return forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
    (props, ref) => (
      <svg
        ref={ref}
        fill={fill ? 'currentColor' : 'none'}
        height="16"
        stroke={fill ? undefined : 'currentColor'}
        viewBox="0 0 16 16"
        width="16"
        {...props}
        style={{
          display: 'block',
          ...(typeof props.style === 'object' && props.style),
        }}
      >
        {path}
      </svg>
    ),
  );
}

const CaretDownIcon = svgIcon(<path d="M12 6H4l4 4.5z" />);
const CaretRightIcon = svgIcon(<path d="M6 12V4l4.5 4z" />);
const CheckIcon = svgIcon(<path d="m2.5 8.5 4 4 7-9" />, false);

export const Menu = {
  ...BaseMenu,
  Arrow,
  CaretDownIcon,
  CaretRightIcon,
  CheckIcon,
  CheckboxItem,
  CheckboxItemIndicator,
  GroupLabel,
  IconButton,
  Item,
  LinkItem,
  Popup,
  Positioner,
  RadioItem,
  RadioItemIndicator,
  Separator,
  SubmenuTrigger,
  Trigger,
};
