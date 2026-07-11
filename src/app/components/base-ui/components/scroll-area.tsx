/* eslint-disable @typescript-eslint/naming-convention */
/**
 * ScrollArea — styled wrapper around `@base-ui/react/scroll-area`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation example
 * (the primary single-scrollbar demo):
 * https://base-ui.com/react/components/scroll-area
 *
 * The Scrollbar style here is the vertical variant from the primary demo. For a
 * both-axes layout, add `data-orientation` widths as in the docs' second demo.
 * The example's `.Paragraph` helper is re-exported as `ScrollArea.Paragraph`.
 * `Corner` passes through from Base UI.
 */
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Root = styled(BaseScrollArea.Root, forwardRef)`
  width: 24rem;
  max-width: calc(100vw - 8rem);
  height: 8.5rem;
  box-sizing: border-box;
  background-color: white;

  @media (prefers-color-scheme: dark) {
    background-color: oklch(14.5% 0 0deg);
  }
`;

const Viewport = styled(BaseScrollArea.Viewport, forwardRef)`
  height: 100%;
  box-sizing: border-box;
  border: 1px solid oklch(14.5% 0 0deg);

  @media (prefers-color-scheme: dark) {
    border: 1px solid white;
  }

  &:focus-visible {
    outline: 2px solid oklch(14.5% 0 0deg);
    outline-offset: -1px;

    @media (prefers-color-scheme: dark) {
      outline-color: white;
    }
  }
`;

const Content = styled(BaseScrollArea.Content, forwardRef)`
  display: flex;
  flex-direction: column;
  padding-right: 1.25rem;
  padding-left: 0.75rem;
  gap: 1rem;
  padding-block: 0.5rem;
`;

const Paragraph = styled('p', forwardRef)`
  margin: 0;
  color: oklch(14.5% 0 0deg);
  font-size: 0.875rem;
  line-height: 1.375rem;

  @media (prefers-color-scheme: dark) {
    color: white;
  }
`;

const Scrollbar = styled(BaseScrollArea.Scrollbar, forwardRef)`
  display: flex;
  width: 1rem;
  justify-content: center;
  margin: 1px;
  background-color: rgb(0 0 0 / 12%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 150ms;

  @media (prefers-color-scheme: dark) {
    background-color: rgb(255 255 255 / 12%);
  }

  &[data-scrolling] {
    transition-duration: 0ms;
  }

  &[data-hovering],
  &[data-scrolling] {
    opacity: 1;
    pointer-events: auto;
  }

  /* Support horizontal scrollbars too (from the docs' both-axes demo). */
  &[data-orientation='horizontal'] {
    height: 1rem;
  }
`;

const Thumb = styled(BaseScrollArea.Thumb, forwardRef)`
  width: 100%;
  background-color: oklch(14.5% 0 0deg);

  @media (prefers-color-scheme: dark) {
    background-color: white;
  }
`;

export const ScrollArea = {
  ...BaseScrollArea,
  Content,
  Paragraph,
  Root,
  Scrollbar,
  Thumb,
  Viewport,
};
