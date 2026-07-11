/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Tabs — styled wrapper around `@base-ui/react/tabs`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation example:
 * https://base-ui.com/react/components/tabs
 *
 * References docs-global CSS variables (`--color-gray-*`, `--color-blue`); see
 * `theme.css`. The example's `.Icon` helper is re-exported as `Tabs.Icon`.
 */
import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Root = styled(BaseTabs.Root, forwardRef)`
  border: 1px solid var(--color-gray-200);
  border-radius: 0.375rem;
`;

const List = styled(BaseTabs.List, forwardRef)`
  position: relative;
  z-index: 0;
  display: flex;
  box-shadow: inset 0 -1px var(--color-gray-200);
  gap: 0.25rem;
  padding-inline: 0.25rem;
`;

const Tab = styled(BaseTabs.Tab, forwardRef)`
  display: flex;
  height: 2rem;
  align-items: center;
  justify-content: center;
  border: 0;
  margin: 0;
  appearance: none;
  background: none;
  color: var(--color-gray-600);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
  outline: 0;
  padding-block: 0;
  padding-inline: 0.5rem;
  user-select: none;
  white-space: nowrap;
  word-break: keep-all;

  &[data-active] {
    color: var(--color-gray-900);
  }

  @media (hover: hover) {
    &:hover {
      color: var(--color-gray-900);
    }
  }

  &:focus-visible {
    position: relative;

    &::before {
      position: absolute;
      border-radius: 0.25rem;
      content: '';
      inset: 0.25rem 0;
      outline: 2px solid var(--color-blue);
      outline-offset: -1px;
    }
  }
`;

const Indicator = styled(BaseTabs.Indicator, forwardRef)`
  position: absolute;
  z-index: -1;
  top: 50%;
  left: 0;
  width: var(--active-tab-width);
  height: 1.5rem;
  border-radius: 0.25rem;
  background-color: var(--color-gray-100);
  transition-duration: 200ms;
  transition-property: translate, width;
  transition-timing-function: ease-in-out;
  translate: var(--active-tab-left) -50%;
`;

const Panel = styled(BaseTabs.Panel, forwardRef)`
  position: relative;
  display: flex;
  height: 8rem;
  align-items: center;
  justify-content: center;
  outline: 0;

  &:focus-visible {
    border-radius: 0.375rem;
    outline: 2px solid var(--color-blue);
    outline-offset: -1px;
  }

  &[hidden] {
    display: none;
  }
`;

/** Icon helper used inside panels in the example. */
const Icon = styled('svg', forwardRef)`
  width: 2.5rem;
  height: 2.5rem;
  color: var(--color-gray-300);
`;

export const Tabs = {
  ...BaseTabs,
  Icon,
  Indicator,
  List,
  Panel,
  Root,
  Tab,
};
