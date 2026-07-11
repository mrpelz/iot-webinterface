/* eslint-disable @typescript-eslint/naming-convention */
/**
 * NavigationMenu — styled wrapper around `@base-ui/react/navigation-menu`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation example
 * (the primary demo):
 * https://base-ui.com/react/components/navigation-menu
 *
 * Covers Root/List/Trigger/Icon/Positioner/Popup/Content/Viewport/Arrow. The
 * example's link-card layout helpers are re-exported as
 * `NavigationMenu.GridLinkList`, `.FlexLinkList`, `.LinkCard`, `.LinkTitle`,
 * and `.LinkDescription`, plus a `NavigationMenu.CaretDownIcon` helper.
 * Item / Link pass through from Base UI.
 */

import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Root = styled(BaseNavigationMenu.Root, forwardRef)`
  min-width: max-content;
  box-sizing: border-box;
  color: oklch(14.5% 0 0deg);

  @media (prefers-color-scheme: dark) {
    color: white;
  }
`;

const List = styled(BaseNavigationMenu.List, forwardRef)`
  position: relative;
  display: flex;
  padding: 0;
  margin: 0;
  gap: 1px;
  list-style: none;
`;

const Trigger = styled(BaseNavigationMenu.Trigger, forwardRef)`
  display: flex;
  height: 2rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0 0.75rem;
  border: 0;
  margin: 0;
  background-color: transparent;
  color: oklch(14.5% 0 0deg);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 400;
  gap: 0.375rem;
  line-height: 1.25rem;
  outline: 0;
  text-decoration: none;
  user-select: none;

  @media (width <= 500px) {
    padding: 0 0.5rem;
  }

  @media (prefers-color-scheme: dark) {
    color: white;
  }

  @media (hover: hover) {
    &:hover {
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
`;

const Icon = styled(BaseNavigationMenu.Icon, forwardRef)`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;

  &[data-popup-open] {
    transform: rotate(180deg);
  }
`;

const Positioner = styled(BaseNavigationMenu.Positioner, forwardRef)`
  --easing: cubic-bezier(0.22, 1, 0.36, 1);
  --duration: 0.35s;

  width: var(--positioner-width);
  max-width: var(--available-width);
  height: var(--positioner-height);
  box-sizing: border-box;
  transition-duration: var(--duration);
  transition-property: top, left, right, bottom;
  transition-timing-function: var(--easing);

  &::before {
    position: absolute;
    content: '';
  }

  &[data-side='top']::before {
    right: 0;
    bottom: -10px;
    left: 0;
    height: 10px;
  }

  &[data-side='bottom']::before {
    top: -10px;
    right: 0;
    left: 0;
    height: 10px;
  }

  &[data-side='left']::before {
    top: 0;
    right: -10px;
    bottom: 0;
    width: 10px;
  }

  &[data-side='right']::before {
    top: 0;
    bottom: 0;
    left: -10px;
    width: 10px;
  }

  &[data-instant] {
    transition: none;
  }
`;

const Popup = styled(BaseNavigationMenu.Popup, forwardRef)`
  position: relative;
  overflow: visible;
  width: var(--popup-width);
  height: var(--popup-height);
  box-sizing: border-box;
  border: 1px solid oklch(14.5% 0 0deg);
  background-color: white;
  box-shadow: 0.25rem 0.25rem 0 rgb(0 0 0 / 12%);
  color: oklch(14.5% 0 0deg);
  outline: 0;
  transform-origin: var(--transform-origin);
  transition-duration: var(--duration);
  transition-property: opacity, transform, width, height;
  transition-timing-function: var(--easing);

  @media (prefers-color-scheme: dark) {
    border: 1px solid white;
    background-color: oklch(14.5% 0 0deg);
    box-shadow: none;
    color: white;
  }

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    transform: scale(0.9);
  }

  &[data-ending-style] {
    transition-duration: 0.15s;
    transition-timing-function: ease;
  }
`;

const Content = styled(BaseNavigationMenu.Content, forwardRef)`
  width: calc(100vw - 40px);
  height: 100%;
  box-sizing: border-box;
  padding: 0.5rem;
  transition:
    opacity calc(var(--duration) * 0.5) ease,
    transform var(--duration) var(--easing);

  @media (width >= 500px) {
    width: max-content;
    max-width: 400px;
  }

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
  }

  &[data-starting-style][data-activation-direction='left'] {
    transform: translateX(-50%);
  }

  &[data-starting-style][data-activation-direction='right'] {
    transform: translateX(50%);
  }

  &[data-ending-style][data-activation-direction='left'] {
    transform: translateX(50%);
  }

  &[data-ending-style][data-activation-direction='right'] {
    transform: translateX(-50%);
  }
`;

const Viewport = styled(BaseNavigationMenu.Viewport, forwardRef)`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
`;

const Arrow = styled(BaseNavigationMenu.Arrow, forwardRef)`
  position: relative;
  display: block;
  overflow: clip;
  width: 12px;
  height: 6px;
  transition:
    left var(--duration) var(--easing),
    right var(--duration) var(--easing);

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

/** Two-column grid of link cards (from the Overview panel). */
const GridLinkList = styled('ul', forwardRef)`
  display: grid;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  grid-template-columns: 1fr 1fr;
  list-style: none;

  @media (width <= 500px) {
    grid-template-columns: 1fr;
  }
`;

/** Single-column list of link cards (from the Handbook panel). */
const FlexLinkList = styled('ul', forwardRef)`
  display: flex;
  max-width: 400px;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  padding: 0;
  margin: 0;
  list-style: none;
`;

const LinkCard = styled(BaseNavigationMenu.Link, forwardRef)`
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0.5rem;
  border: 0;
  background-color: transparent;
  color: inherit;
  text-align: left;
  text-decoration: none;

  &[data-popup-open] {
    background-color: oklch(97% 0 0deg);

    @media (prefers-color-scheme: dark) {
      background-color: oklch(26.9% 0 0deg);
    }
  }

  @media (hover: hover) {
    &:hover {
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
`;

const LinkTitle = styled('h3', forwardRef)`
  margin: 0 0 4px;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1rem;
`;

const LinkDescription = styled('p', forwardRef)`
  margin: 0;
  color: oklch(55.6% 0 0deg);
  font-size: 0.875rem;
  line-height: 1.25rem;

  @media (prefers-color-scheme: dark) {
    color: oklch(70.8% 0 0deg);
  }
`;

const CaretDownIcon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
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
      <path d="M12 6H4l4 4.5z" />
    </svg>
  ),
);

export const NavigationMenu = {
  ...BaseNavigationMenu,
  Arrow,
  CaretDownIcon,
  Content,
  FlexLinkList,
  GridLinkList,
  Icon,
  LinkCard,
  LinkDescription,
  LinkTitle,
  List,
  Popup,
  Positioner,
  Root,
  Trigger,
  Viewport,
};
