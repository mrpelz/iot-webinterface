import { styled } from 'goober';
import {
  FunctionComponent,
  InputHTMLAttributes,
  MouseEventHandler,
} from 'preact';

import { bindComponent } from '../util/combine-components.js';
import { isiDevice } from '../util/useragent.js';

const HapticLabel = styled('label')`
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0;
`;

const HapticInput = bindComponent(
  // eslint-disable-next-line prettier/prettier
  styled<Partial<InputHTMLAttributes<HTMLInputElement> & { switch: true }>>('input')`
    position: absolute;
    width: 0;
    height: 0;
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

const preventClick: MouseEventHandler<HTMLInputElement> = (event) =>
  event.stopPropagation();

export const Haptic: FunctionComponent = () => {
  if (!isiDevice) return null;

  return (
    <HapticLabel>
      <HapticInput onClick={preventClick}></HapticInput>
    </HapticLabel>
  );
};
