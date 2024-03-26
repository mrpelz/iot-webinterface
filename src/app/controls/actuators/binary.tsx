import { FunctionComponent } from 'preact';
import { useCallback } from 'preact/hooks';

import { BlendOver } from '../../components/blend-over.js';
import { BodyLarge } from '../../components/controls.js';
import { useColorBody } from '../../hooks/use-color-body.js';
import { useDelay } from '../../hooks/use-delay.js';
import { I18nKey } from '../../i18n/main.js';
import { Translation } from '../../state/i18n.js';
import { $rootPath } from '../../state/path.js';
import {
  useChildGetter,
  useChildSetter,
  useGetter,
} from '../../state/web-api.js';
import { getSignal } from '../../util/signal.js';
import {
  HierarchyElement,
  HierarchyElementPropertyActuator,
  isMetaPropertyActuator,
  ValueType,
} from '../../web-api.js';
import { Cell } from '../main.js';

export type BinaryActuatorElement = HierarchyElementPropertyActuator & {
  meta: { valueType: ValueType.BOOLEAN };
};

export const isBinaryActuatorElement = (
  element: HierarchyElement,
): element is BinaryActuatorElement =>
  isMetaPropertyActuator(element.meta) &&
  element.meta.valueType === ValueType.BOOLEAN;

export const BinaryActuator: FunctionComponent<{
  element: BinaryActuatorElement;
  negativeKey?: I18nKey;
  onClick?: () => void;
  positiveKey?: I18nKey;
  title?: I18nKey;
}> = ({ element, negativeKey = 'off', onClick, positiveKey = 'on', title }) => {
  const {
    property,
    meta: { actuated },
  } = element;

  const value = useGetter<boolean>(element);

  const loading = useChildGetter<boolean>(element, 'loading');

  const flip = useChildSetter<null>(element, 'flip');
  const handleClick = useCallback(() => flip?.(null), [flip]);

  const ColorBody = useColorBody(BodyLarge, property, actuated);

  const route = getSignal($rootPath);
  const allowTransition = Boolean(useDelay(route, 300, true));

  return (
    <Cell
      onClick={flip && !onClick ? handleClick : onClick}
      title={<Translation i18nKey={title || property} capitalize={true} />}
    >
      <BlendOver
        blendOver={value ? 1 : 0}
        direction="block"
        transition={allowTransition && value !== null && !loading}
        overlay={
          value === null ? undefined : (
            <ColorBody>
              <Translation i18nKey={positiveKey} />
            </ColorBody>
          )
        }
      >
        <BodyLarge>
          {value === null ? (
            '?'
          ) : (
            <>
              <Translation i18nKey={negativeKey} />
              {loading ? '…' : null}
            </>
          )}
        </BodyLarge>
      </BlendOver>
    </Cell>
  );
};
