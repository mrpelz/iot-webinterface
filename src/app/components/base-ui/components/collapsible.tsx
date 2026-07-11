/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Collapsible — styled wrapper around `@base-ui/react/collapsible`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation example:
 * https://base-ui.com/react/components/collapsible
 *
 * The example includes a caret `Collapsible.Icon` (rotated when open) and a
 * `Collapsible.Content` wrapper; both are re-exported for the documented look.
 */

import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Root = styled(BaseCollapsible.Root, forwardRef)`
  display: flex;
  width: 12rem;
  min-height: 9rem;
  flex-direction: column;
  justify-content: center;
  color: oklch(14.5% 0 0deg);

  @media (prefers-color-scheme: dark) {
    color: white;
  }
`;

const StyledIcon = styled('svg', forwardRef)`
  transition: transform 100ms ease-out;
`;

/** Caret icon that rotates when the panel is open. */
const Icon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  (props, ref) => (
    <StyledIcon
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
    </StyledIcon>
  ),
);

const Trigger = styled(BaseCollapsible.Trigger, forwardRef)`
  display: flex;
  height: 2rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.5rem 0 0.75rem;
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

  &[data-panel-open] ${StyledIcon} {
    transform: rotate(90deg);
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

const Panel = styled(BaseCollapsible.Panel, forwardRef)`
  display: flex;
  overflow: hidden;
  height: var(--collapsible-panel-height);
  flex-direction: column;
  justify-content: end;
  font-size: 0.875rem;
  line-height: 1.25rem;
  transition: height 150ms ease-out;

  &[hidden]:not([hidden='until-found']) {
    display: none;
  }

  &[data-starting-style],
  &[data-ending-style] {
    height: 0;
  }
`;

/** Inner content wrapper used inside `Collapsible.Panel` in the example. */
const Content = styled('div', forwardRef)`
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0.875rem;
  gap: 0.5rem;
`;

export const Collapsible = {
  ...BaseCollapsible,
  Content,
  Icon,
  Panel,
  Root,
  Trigger,
};
