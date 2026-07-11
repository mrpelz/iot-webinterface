/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Select — styled wrapper around `@base-ui/react/select`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation examples:
 * https://base-ui.com/react/components/select
 *
 * Covers Trigger (`.Select`), Value, Label, Positioner, Popup, List, Item,
 * ItemIndicator, ItemText, ScrollUpArrow/ScrollDownArrow (`.ScrollArrow`), and
 * the Group/GroupLabel/Separator parts from the grouped demo. Helper icons
 * (CaretUpDownIcon, CheckIcon, CaretUpIcon, CaretDownIcon) are re-exported.
 * Portal/Backdrop/Icon/Arrow pass through from Base UI.
 */

import { Select as BaseSelect } from '@base-ui/react/select';
import { css, styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { bindComponent } from '../../../util/combine-components.js';

const Label = styled(BaseSelect.Label, forwardRef)`
  color: oklch(14.5% 0 0deg);
  cursor: default;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.25rem;

  @media (prefers-color-scheme: dark) {
    color: white;
  }
`;

const Value = styled(BaseSelect.Value, forwardRef)`
  &[data-placeholder] {
    color: oklch(55.6% 0 0deg);

    @media (prefers-color-scheme: dark) {
      color: oklch(70.8% 0 0deg);
    }
  }
`;

const Trigger = styled(BaseSelect.Trigger, forwardRef)`
  display: flex;
  min-width: 10rem;
  height: 2rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  padding-right: 0.25rem;
  padding-left: 0.5rem;
  border: 1px solid oklch(14.5% 0 0deg);
  margin: 0;
  background-color: white;
  color: oklch(14.5% 0 0deg);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 400;
  gap: 0.75rem;
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

  &[data-popup-open] {
    background-color: oklch(97% 0 0deg);

    @media (prefers-color-scheme: dark) {
      background-color: oklch(26.9% 0 0deg);
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

const Positioner = styled(BaseSelect.Positioner, forwardRef)`
  z-index: 10;
  outline: none;
  user-select: none;
`;

const Popup = styled(BaseSelect.Popup, forwardRef)`
  min-width: var(--anchor-width);
  box-sizing: border-box;
  border: 1px solid oklch(14.5% 0 0deg);
  background-clip: padding-box;
  background-color: white;
  box-shadow: 0.25rem 0.25rem 0 rgb(0 0 0 / 12%);
  color: oklch(14.5% 0 0deg);
  outline: 0;
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

  &[data-side='none'] {
    min-width: calc(var(--anchor-width) + 1.75rem);
    opacity: 1;
    transform: translateY(1px);
    transition: none;
  }
`;

const List = styled(BaseSelect.List, forwardRef)`
  position: relative;
  max-height: var(--available-height);
  box-sizing: border-box;
  overflow-y: auto;
  padding-block: 0.25rem;
  scroll-padding-block: 1.5rem;
`;

const Item = styled(BaseSelect.Item, forwardRef)`
  display: grid;
  box-sizing: border-box;
  align-items: center;
  padding-right: 1rem;
  padding-left: 0.625rem;
  cursor: default;
  font-size: 0.875rem;
  gap: 0.5rem;
  grid-template-columns: 1rem 1fr;
  line-height: 1.25rem;
  outline: 0;
  padding-block: 0.375rem;
  user-select: none;

  &[data-highlighted] {
    background-color: oklch(14.5% 0 0deg);
    color: white;

    @media (prefers-color-scheme: dark) {
      background-color: white;
      color: oklch(14.5% 0 0deg);
    }
  }
`;

const ItemIndicator = styled(BaseSelect.ItemIndicator, forwardRef)`
  grid-column-start: 1;
`;

const ItemText = styled(BaseSelect.ItemText, forwardRef)`
  grid-column-start: 2;
`;

const Group = styled(BaseSelect.Group, forwardRef)`
  display: block;
  padding-bottom: 0.125rem;

  &:last-child {
    padding-bottom: 0;
  }
`;

const GroupLabel = styled(BaseSelect.GroupLabel, forwardRef)`
  box-sizing: border-box;
  padding-right: 1rem;
  padding-left: calc(0.625rem + 1rem + 0.5rem);
  color: oklch(55.6% 0 0deg);
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding-block: 0.375rem;
  user-select: none;

  @media (prefers-color-scheme: dark) {
    color: oklch(70.8% 0 0deg);
  }
`;

const Separator = styled(BaseSelect.Separator, forwardRef)`
  height: 1px;
  background-color: oklch(14.5% 0 0deg);
  margin-block: 0.25rem;
  margin-inline: 1rem;

  @media (prefers-color-scheme: dark) {
    background-color: white;
  }
`;

const scrollArrowStyles = css`
  z-index: 1;
  display: flex;
  width: 100%;
  height: 1rem;
  align-items: center;
  justify-content: center;
  background-color: white;
  cursor: default;
  font-size: 0.75rem;
  text-align: center;

  @media (prefers-color-scheme: dark) {
    background-color: oklch(14.5% 0 0deg);
  }

  &::before {
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    content: '';
  }

  &[data-direction='up'] {
    top: 0;

    &[data-side='none']::before {
      top: -100%;
    }
  }

  &[data-direction='down'] {
    bottom: 0;

    &[data-side='none']::before {
      bottom: -100%;
    }
  }
`;

const ScrollUpArrow = bindComponent(BaseSelect.ScrollUpArrow, {
  className: scrollArrowStyles,
});

const ScrollDownArrow = bindComponent(BaseSelect.ScrollDownArrow, {
  className: scrollArrowStyles,
});

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

const CaretUpDownIcon = svgIcon(<path d="M11 10H5l3 3.5zm0-4H5l3-3.5z" />);
const CaretUpIcon = svgIcon(<path d="M12 10H4l4-4.5z" />);
const CaretDownIcon = svgIcon(<path d="M12 6H4l4 4.5z" />);
const CheckIcon = svgIcon(<path d="m2.5 8.5 4 4 7-9" />, false);

export const Select = {
  ...BaseSelect,
  CaretDownIcon,
  CaretUpDownIcon,
  CaretUpIcon,
  CheckIcon,
  Group,
  GroupLabel,
  Item,
  ItemIndicator,
  ItemText,
  Label,
  List,
  Popup,
  Positioner,
  ScrollDownArrow,
  ScrollUpArrow,
  Separator,
  Trigger,
  Value,
};
