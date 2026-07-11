/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Accordion — styled wrapper around `@base-ui/react/accordion`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation example:
 * https://base-ui.com/react/components/accordion
 *
 * Usage:
 *   import { Accordion } from './components/accordion.js';
 *
 *   <Accordion.Root>
 *     <Accordion.Item>
 *       <Accordion.Header>
 *         <Accordion.Trigger>
 *           What is Base UI? <Accordion.Icon />
 *         </Accordion.Trigger>
 *       </Accordion.Header>
 *       <Accordion.Panel>
 *         <Accordion.Content>…</Accordion.Content>
 *       </Accordion.Panel>
 *     </Accordion.Item>
 *   </Accordion.Root>
 */
import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Root = styled(BaseAccordion.Root, forwardRef)`
  display: flex;
  width: 100%;
  max-width: 20rem;
  box-sizing: border-box;
  flex-direction: column;
  border: 1px solid oklch(14.5% 0 0deg);
  color: oklch(14.5% 0 0deg);

  @media (prefers-color-scheme: dark) {
    border: 1px solid white;
    color: white;
  }
`;

const Item = styled(BaseAccordion.Item, forwardRef)`
  & + & {
    border-top: 1px solid oklch(14.5% 0 0deg);

    @media (prefers-color-scheme: dark) {
      border-top: 1px solid white;
    }
  }
`;

const Header = styled(BaseAccordion.Header, forwardRef)`
  margin: 0;
`;

const Trigger = styled(BaseAccordion.Trigger, forwardRef)`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 0;
  margin: 0;
  background-color: transparent;
  color: oklch(14.5% 0 0deg);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 400;
  gap: 1rem;
  line-height: 1.25rem;
  text-align: left;
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
    z-index: 1;
    outline: 2px solid oklch(14.5% 0 0deg);

    @media (prefers-color-scheme: dark) {
      outline-color: white;
    }
  }
`;

const StyledIconSvg = styled('svg', forwardRef)`
  transition: transform 100ms ease-out;

  [data-panel-open] > & {
    transform: rotate(45deg);
  }
`;

/** The plus/close icon used by the documentation example. */
const Icon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  (props, ref) => (
    <StyledIconSvg
      ref={ref}
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      {...props}
      style={{
        display: 'block',
        ...(typeof props.style === 'object' && props.style),
      }}
    >
      <path d="M1.5 8h13M8 14.5v-13" />
    </StyledIconSvg>
  ),
);

const Panel = styled(BaseAccordion.Panel, forwardRef)`
  overflow: hidden;
  height: var(--accordion-panel-height);
  box-sizing: border-box;
  font-size: 0.875rem;
  line-height: 1.25rem;
  transition: height 150ms ease-out;

  &[data-starting-style],
  &[data-ending-style] {
    height: 0;
  }
`;

/** Inner content wrapper used inside `Accordion.Panel` in the example. */
const Content = styled('div', forwardRef)`
  padding: 0.5rem 0.75rem;
`;

export const Accordion = {
  ...BaseAccordion,
  Content,
  Header,
  Icon,
  Item,
  Panel,
  Root,
  Trigger,
};

export type { Accordion as AccordionNamespace } from '@base-ui/react/accordion';
