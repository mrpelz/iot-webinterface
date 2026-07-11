/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Combobox — styled wrapper around `@base-ui/react/combobox`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation examples:
 * https://base-ui.com/react/components/combobox
 *
 * Covers InputGroup/Input/Positioner/Popup/List/Item/ItemIndicator/Empty plus
 * the Trigger and Clear action buttons, the Chip/ChipRemove multi-select parts,
 * and Group/GroupLabel/Separator from the grouped demo. The `ActionButtons`
 * wrapper is re-exported as `Combobox.ActionButtons`, and helper icons
 * (CaretDownIcon, CheckIcon, XIcon) are included. Parts without dedicated CSS
 * (Portal, Backdrop, Icon, Value, Chips, Collection, Status, Row, Arrow) pass
 * through from Base UI.
 */

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { css, styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { bindComponent } from '../../../util/combine-components.js';

const InputGroup = styled(BaseCombobox.InputGroup, forwardRef)`
  position: relative;
  width: 14rem;
  height: 2rem;
  box-sizing: border-box;
  border: 1px solid oklch(14.5% 0 0deg);
  background-color: white;

  @media (prefers-color-scheme: dark) {
    border: 1px solid white;
    background-color: oklch(14.5% 0 0deg);
  }

  &:focus-within {
    outline: 2px solid oklch(14.5% 0 0deg);
    outline-offset: -1px;

    @media (prefers-color-scheme: dark) {
      outline-color: white;
    }
  }
`;

const Input = styled(BaseCombobox.Input, forwardRef)`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 calc(0.5rem + 2rem) 0 0.5rem;
  border: none;
  border-radius: 0;
  margin: 0;
  background-color: white;
  color: oklch(14.5% 0 0deg);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;

  @media (any-pointer: coarse) {
    font-size: 1rem;
    line-height: 1.5rem;
  }

  @media (prefers-color-scheme: dark) {
    background-color: oklch(14.5% 0 0deg);
    color: white;
  }

  &::placeholder {
    color: oklch(55.6% 0 0deg);

    @media (prefers-color-scheme: dark) {
      color: oklch(70.8% 0 0deg);
    }
  }

  &:focus {
    outline: none;
  }
`;

const Label = styled(BaseCombobox.Label, forwardRef)`
  color: oklch(14.5% 0 0deg);
  cursor: default;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.25rem;

  @media (prefers-color-scheme: dark) {
    color: white;
  }
`;

/** Absolutely-positioned wrapper for the Clear + Trigger action buttons. */
const ActionButtons = styled('div', forwardRef)`
  position: absolute;
  right: 0;
  bottom: 0;
  display: flex;
  height: 100%;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  color: oklch(55.6% 0 0deg);

  @media (prefers-color-scheme: dark) {
    color: oklch(70.8% 0 0deg);
  }
`;

const actionButtonStyles = css`
  display: flex;
  width: 1.5rem;
  height: 100%;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: none;
  color: oklch(14.5% 0 0deg);

  @media (prefers-color-scheme: dark) {
    color: white;
  }
`;

const Trigger = bindComponent(BaseCombobox.Trigger, {
  className: actionButtonStyles,
});

const Clear = bindComponent(BaseCombobox.Clear, {
  className: actionButtonStyles,
});

const Chip = styled(BaseCombobox.Chip, forwardRef)`
  display: flex;
  overflow: hidden;
  min-height: calc(1.5rem - 2px);
  box-sizing: border-box;
  align-items: center;
  padding: 0 0.2rem 0 0.4rem;
  background-color: oklch(97% 0 0deg);
  color: oklch(14.5% 0 0deg);
  cursor: default;
  font-size: 0.875rem;
  gap: 0.25rem;
  line-height: 1;
  outline: 0;

  @media (prefers-color-scheme: dark) {
    background-color: oklch(26.9% 0 0deg);
    color: white;
  }

  &:focus-within {
    background-color: oklch(14.5% 0 0deg);
    color: white;

    @media (prefers-color-scheme: dark) {
      background-color: white;
      color: oklch(14.5% 0 0deg);
    }
  }

  @media (hover: hover) {
    &[data-highlighted] {
      background-color: oklch(14.5% 0 0deg);
      color: white;

      @media (prefers-color-scheme: dark) {
        background-color: white;
        color: oklch(14.5% 0 0deg);
      }
    }
  }
`;

const ChipRemove = styled(BaseCombobox.ChipRemove, forwardRef)`
  display: flex;
  width: 1rem;
  height: 1rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: none;
  color: inherit;

  @media (hover: hover) {
    &:hover {
      background-color: oklch(92.2% 0 0deg);

      @media (prefers-color-scheme: dark) {
        background-color: oklch(37.1% 0 0deg);
      }
    }
  }
`;

const Positioner = styled(BaseCombobox.Positioner, forwardRef)`
  outline: 0;
`;

const Popup = styled(BaseCombobox.Popup, forwardRef)`
  width: var(--anchor-width);
  max-width: var(--available-width);
  box-sizing: border-box;
  border: 1px solid oklch(14.5% 0 0deg);
  background-color: white;
  box-shadow: 0.25rem 0.25rem 0 rgb(0 0 0 / 12%);
  color: oklch(14.5% 0 0deg);
  transform-origin: var(--transform-origin);
  transition:
    opacity 0.1s,
    transform 0.1s;

  @media (prefers-color-scheme: dark) {
    border: 1px solid white;
    background-color: oklch(14.5% 0 0deg);
    box-shadow: none;
    color: white;
  }

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    transform: scale(0.95);
  }
`;

const List = styled(BaseCombobox.List, forwardRef)`
  max-height: min(22.5rem, var(--available-height));
  box-sizing: border-box;
  outline: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-block: 0.25rem;
  scroll-padding-block: 0.25rem;

  &[data-empty] {
    padding: 0;
  }
`;

const Item = styled(BaseCombobox.Item, forwardRef)`
  display: grid;
  box-sizing: border-box;
  align-items: center;
  padding-right: 0.5rem;
  padding-left: 0.5rem;
  cursor: default;
  font-size: 0.875rem;
  gap: 0.5rem;
  grid-template-columns: 1rem 1fr;
  line-height: 1rem;
  outline: 0;
  padding-block: 0.5rem;
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
    inset-inline: 0;

    @media (prefers-color-scheme: dark) {
      background-color: white;
    }
  }
`;

const ItemIndicator = styled(BaseCombobox.ItemIndicator, forwardRef)`
  grid-column-start: 1;
`;

const Group = styled(BaseCombobox.Group, forwardRef)`
  display: block;
  padding-bottom: 0.5rem;

  &:last-child {
    padding-bottom: 0;
  }
`;

const GroupLabel = styled(BaseCombobox.GroupLabel, forwardRef)`
  box-sizing: border-box;
  padding: 0.5rem 0.5rem 0.5rem 2rem;
  color: oklch(55.6% 0 0deg);
  font-size: 0.875rem;
  line-height: 1rem;
  user-select: none;

  @media (prefers-color-scheme: dark) {
    color: oklch(70.8% 0 0deg);
  }
`;

const Separator = styled(BaseCombobox.Separator, forwardRef)`
  height: 1px;
  margin: 0.375rem 1rem;
  background-color: oklch(97% 0 0deg);

  @media (prefers-color-scheme: dark) {
    background-color: oklch(26.9% 0 0deg);
  }
`;

const Empty = styled(BaseCombobox.Empty, forwardRef)`
  box-sizing: border-box;
  padding: 1rem 1rem 1rem 0.5rem;
  color: oklch(55.6% 0 0deg);
  font-size: 0.875rem;
  line-height: 1rem;

  @media (prefers-color-scheme: dark) {
    color: oklch(70.8% 0 0deg);
  }
`;

function svgIcon(
  path: React.ReactNode,
  opts: { caps?: boolean; fill?: boolean } = {},
) {
  const { fill = true, caps = false } = opts;
  return forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
    (props, ref) => (
      <svg
        ref={ref}
        fill={fill ? 'currentColor' : 'none'}
        height="16"
        stroke={fill ? undefined : 'currentColor'}
        strokeLinecap={caps ? 'square' : undefined}
        strokeLinejoin={caps ? 'round' : undefined}
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
const CheckIcon = svgIcon(<path d="m2.5 8.5 4 4 7-9" />, { fill: false });
const XIcon = svgIcon(<path d="m4.5 4.5 7 7m-7 0 7-7" />, {
  caps: true,
  fill: false,
});

export const Combobox = {
  ...BaseCombobox,
  ActionButtons,
  CaretDownIcon,
  CheckIcon,
  Chip,
  ChipRemove,
  Clear,
  Empty,
  Group,
  GroupLabel,
  Input,
  InputGroup,
  Item,
  ItemIndicator,
  Label,
  List,
  Popup,
  Positioner,
  Separator,
  Trigger,
  XIcon,
};
