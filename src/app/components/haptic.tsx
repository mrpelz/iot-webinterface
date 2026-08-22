import { styled } from 'goober';
import { FunctionComponent, InputHTMLAttributes } from 'preact';

import { bindComponent } from '../util/combine-components.js';
import { isiDevice } from '../util/useragent.js';

const Haptic_ = bindComponent(
  // eslint-disable-next-line prettier/prettier
  styled<Partial<InputHTMLAttributes<HTMLInputElement> & { switch: true }>>('input')`
    position: absolute;
    appearance: none;
    inset: 0;
    touch-action: manipulation;
  `,
  {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'aria-hidden': true,
    switch: true,
    tabIndex: -1,
    type: 'checkbox',
  },
);

export const Haptic: FunctionComponent = ({ children }) => {
  if (!isiDevice) return children;

  return <Haptic_>{children}</Haptic_>;
};
