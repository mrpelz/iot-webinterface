/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Toggle — styled wrapper around `@base-ui/react/toggle`.
 *
 * CSS ported verbatim from the Base UI "CSS Modules" documentation example:
 * https://base-ui.com/react/components/toggle
 *
 * Toggle is a single `<button>`. The example's heart icons are re-exported as
 * `Toggle.HeartFilledIcon` and `Toggle.HeartOutlineIcon`.
 */

import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const StyledToggle = styled(BaseToggle, forwardRef)`
  display: flex;
  width: 2rem;
  height: 2rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 0;
  margin: 0;
  background-color: transparent;
  color: oklch(14.5% 0 0deg);
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

  &[data-pressed] {
    color: oklch(14.5% 0 0deg);

    @media (prefers-color-scheme: dark) {
      color: white;
    }
  }
`;

const HeartFilledIcon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
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
      <path d="M7.99961 13.8667C7.88761 13.8667 7.77561 13.8315 7.68121 13.7611C7.43321 13.5766 1.59961 9.1963 1.59961 5.8667C1.59961 3.80856 3.27481 2.13336 5.33294 2.13336C6.59054 2.13336 7.49934 2.81176 7.99961 3.3131C8.49988 2.81176 9.40868 2.13336 10.6663 2.13336C12.7244 2.13336 14.3996 3.80803 14.3996 5.8667C14.3996 9.1963 8.56601 13.5766 8.31801 13.7616C8.22361 13.8315 8.11161 13.8667 7.99961 13.8667Z" />
    </svg>
  ),
);

const HeartOutlineIcon = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
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
      <path
        clipRule="evenodd"
        d="m7.99961 4.8232-.75505-.75666c-.40333-.40419-1.0559-.86651-1.91162-.86651-1.46903 0-2.66666 1.19764-2.66666 2.66667 0 .5412.24648 1.2356.75339 2.04713.49581.79376 1.17682 1.59861 1.89311 2.33647 1.06989 1.1022 2.1604 1.9962 2.68705 2.4102.52751-.4149 1.61735-1.3085 2.68657-2.4101.7163-.73792 1.3973-1.54278 1.8932-2.33656.5069-.81154.7533-1.50594.7533-2.04714 0-1.46947-1.1975-2.66667-2.6666-2.66667-.85574 0-1.50831.46232-1.91164.86651zm-.01387-1.52394c-.5031-.49988-1.40673-1.1659-2.6528-1.1659-2.05813 0-3.73333 1.6752-3.73333 3.73334 0 3.3296 5.8336 7.7099 6.0816 7.8944a.532.532 0 0 0 .3184.1056c.112 0 .224-.0352.3184-.1051.248-.185 6.08159-4.5653 6.08159-7.8949 0-2.05867-1.6752-3.73334-3.7333-3.73334-1.24617 0-2.14985.66611-2.65293 1.166q-.0069.00686-.0137.01367c.00002-.00003-.00002.00002 0 0-.00459-.0046-.00927-.00914-.01393-.01377"
        fillRule="evenodd"
      />
    </svg>
  ),
);

export const Toggle = Object.assign(StyledToggle, {
  HeartFilledIcon,
  HeartOutlineIcon,
});
