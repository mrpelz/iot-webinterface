/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Separator — styled wrapper around `@base-ui/react/separator`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation example:
 * https://base-ui.com/react/components/separator
 *
 * Separator is a single element. The example's `Container` and `Link` helpers
 * (used to demo a nav row) are re-exported as `Separator.Container` and
 * `Separator.Link`.
 */
import { Separator as BaseSeparator } from '@base-ui/react/separator';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const StyledSeparator = styled(BaseSeparator, forwardRef)`
  width: 1px;
  background-color: oklch(87% 0 0deg);

  @media (prefers-color-scheme: dark) {
    background-color: oklch(37.1% 0 0deg);
  }
`;

/** Flex row used to lay out items around the separator in the example. */
const Container = styled('div', forwardRef)`
  display: flex;
  gap: 1rem;
  text-wrap: nowrap;
`;

/** Link styling from the example nav. */
const Link = styled('a', forwardRef)`
  color: oklch(14.5% 0 0deg);
  font-size: 0.875rem;
  line-height: 1.25rem;
  text-decoration-color: oklch(87% 0 0deg);
  text-decoration-line: none;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;

  @media (prefers-color-scheme: dark) {
    color: white;
    text-decoration-color: oklch(37.1% 0 0deg);
  }

  @media (hover: hover) {
    &:hover {
      text-decoration-line: underline;
    }
  }

  &:focus-visible {
    outline: 2px solid oklch(14.5% 0 0deg);
    outline-offset: 2px;
    text-decoration-line: none;

    @media (prefers-color-scheme: dark) {
      outline-color: white;
    }
  }
`;

export const Separator = Object.assign(StyledSeparator, { Container, Link });
