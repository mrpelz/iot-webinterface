import { styled } from 'goober';
import { InputHTMLAttributes } from 'preact';

import { bindComponent } from '../util/combine-components.js';

export const Haptic = bindComponent(
  // eslint-disable-next-line prettier/prettier
  styled<Partial<InputHTMLAttributes<HTMLInputElement> & { switch: true }>>('input')`
    position: absolute;
    appearance: none;
    inset: 0;
  `,
  {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'aria-hidden': true,
    switch: true,
    tabIndex: -1,
    type: 'checkbox',
  },
);
