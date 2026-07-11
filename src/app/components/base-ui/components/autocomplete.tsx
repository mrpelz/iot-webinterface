/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Autocomplete — styled wrapper around `@base-ui/react/autocomplete`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation examples
 * (the primary demo, with Group/GroupLabel/Separator/Empty from the grouped
 * demo, which share the same base styling):
 * https://base-ui.com/react/components/autocomplete
 *
 * The example's enclosing `<label>` (`.Label`) is re-exported as
 * `Autocomplete.Label`. Parts without dedicated CSS in the primary demos
 * (Trigger, Icon, Clear, Value, InputGroup, Row, Collection, Status, Arrow,
 * Backdrop) pass through from Base UI, along with the `useFilter` hook.
 */
import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

/** Enclosing label used to give the input an accessible name. */
const Label = styled('label', forwardRef)`
  display: flex;
  flex-direction: column;
  color: oklch(14.5% 0 0deg);
  font-size: 0.875rem;
  font-weight: 700;
  gap: 0.25rem;
  line-height: 1.25rem;

  @media (prefers-color-scheme: dark) {
    color: white;
  }
`;

const Input = styled(BaseAutocomplete.Input, forwardRef)`
  width: 16rem;
  height: 2rem;
  box-sizing: border-box;
  padding: 0 0.5rem;
  border: 1px solid oklch(14.5% 0 0deg);
  border-radius: 0;
  margin: 0;
  background-color: white;
  color: oklch(14.5% 0 0deg);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
  outline: none;

  @media (any-pointer: coarse) {
    font-size: 1rem;
    line-height: 1.5rem;
  }

  @media (prefers-color-scheme: dark) {
    border: 1px solid white;
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
    outline: 2px solid oklch(14.5% 0 0deg);
    outline-offset: -1px;

    @media (prefers-color-scheme: dark) {
      outline-color: white;
    }
  }
`;

const Positioner = styled(BaseAutocomplete.Positioner, forwardRef)`
  outline: 0;

  &[data-empty] {
    display: none;
  }
`;

const Popup = styled(BaseAutocomplete.Popup, forwardRef)`
  width: var(--anchor-width);
  max-width: var(--available-width);
  box-sizing: border-box;
  border: 1px solid oklch(14.5% 0 0deg);
  background-color: white;
  box-shadow: 0.25rem 0.25rem 0 rgb(0 0 0 / 12%);
  color: oklch(14.5% 0 0deg);

  @media (prefers-color-scheme: dark) {
    border: 1px solid white;
    background-color: oklch(14.5% 0 0deg);
    box-shadow: none;
    color: white;
  }
`;

const List = styled(BaseAutocomplete.List, forwardRef)`
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

const Item = styled(BaseAutocomplete.Item, forwardRef)`
  display: flex;
  box-sizing: border-box;
  align-items: center;
  padding-right: 0.5rem;
  padding-left: 0.5rem;
  cursor: default;
  font-size: 0.875rem;
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

const Group = styled(BaseAutocomplete.Group, forwardRef)`
  display: block;
  padding-bottom: 0.5rem;

  &:last-child {
    padding-bottom: 0;
  }
`;

const GroupLabel = styled(BaseAutocomplete.GroupLabel, forwardRef)`
  box-sizing: border-box;
  padding: 0.5rem;
  color: oklch(55.6% 0 0deg);
  font-size: 0.875rem;
  line-height: 1rem;
  user-select: none;

  @media (prefers-color-scheme: dark) {
    color: oklch(70.8% 0 0deg);
  }
`;

const Separator = styled(BaseAutocomplete.Separator, forwardRef)`
  height: 1px;
  margin: 0.375rem 1rem;
  background-color: oklch(97% 0 0deg);

  @media (prefers-color-scheme: dark) {
    background-color: oklch(26.9% 0 0deg);
  }
`;

const Empty = styled(BaseAutocomplete.Empty, forwardRef)`
  box-sizing: border-box;
  padding: 1rem 1rem 1rem 0.5rem;
  color: oklch(55.6% 0 0deg);
  font-size: 0.875rem;
  line-height: 1rem;

  @media (prefers-color-scheme: dark) {
    color: oklch(70.8% 0 0deg);
  }
`;

export const Autocomplete = {
  ...BaseAutocomplete,
  Empty,
  Group,
  GroupLabel,
  Input,
  Item,
  Label,
  List,
  Popup,
  Positioner,
  Separator,
};
