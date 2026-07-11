/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Avatar — styled wrapper around `@base-ui/react/avatar`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation example:
 * https://base-ui.com/react/components/avatar
 */
import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Root = styled(BaseAvatar.Root, forwardRef)`
  display: inline-flex;
  overflow: hidden;
  width: 2rem;
  height: 2rem;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  background-color: oklch(92.2% 0 0deg);
  color: oklch(14.5% 0 0deg);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1;
  user-select: none;
  vertical-align: middle;

  @media (prefers-color-scheme: dark) {
    background-color: oklch(26.9% 0 0deg);
    color: white;
  }
`;

const Image = styled(BaseAvatar.Image, forwardRef)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Fallback = styled(BaseAvatar.Fallback, forwardRef)`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
`;

export const Avatar = {
  ...BaseAvatar,
  Fallback,
  Image,
  Root,
};
