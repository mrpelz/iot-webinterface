import { FunctionComponent } from 'preact';
import { useCallback } from 'preact/hooks';

import { Match } from '../../api.js';
import { BlendOver } from '../../components/blend-over.js';
import { BodyLarge } from '../../components/controls.js';
import { useColorBody } from '../../hooks/use-color-body.js';
import { useDelay } from '../../hooks/use-delay.js';
import {
  useTypedCollector,
  useTypedEmitter,
} from '../../hooks/use-interaction.js';
import { I18nKey } from '../../i18n/main.js';
import { $rootPath } from '../../state/path.js';
import { getSignal } from '../../util/signal.js';
import { Translation } from '../../views/translation.js';
import { Cell } from '../main.js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type TBinaryActuator = Match<{
  $: 'output';
}>;

export const BinaryActuator: FunctionComponent<{
  actuator: TBinaryActuator;
  negativeKey?: I18nKey;
  onClick?: () => void;
  positiveKey?: I18nKey;
  title?: I18nKey;
}> = ({
  actuator,
  negativeKey = 'off',
  onClick,
  positiveKey = 'on',
  title,
}) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const value = useTypedEmitter(actuator.main).value;
  const loading = useTypedEmitter(actuator.actuatorStaleness.loading).value;

  const flip = useTypedCollector(actuator.flip);
  const handleClick = useCallback(() => flip?.(null), [flip]);

  const ColorBody = useColorBody(
    BodyLarge,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    actuator.$ref.path.at(-1),
    actuator.topic,
  );

  const route = getSignal($rootPath);
  const allowTransition = Boolean(useDelay(route, 300, true));

  return (
    <Cell
      onClick={onClick ?? handleClick}
      title={
        <Translation i18nKey={title || actuator.topic} capitalize={true} />
      }
    >
      <BlendOver
        blendOver={value ? 1 : 0}
        direction="block"
        transition={allowTransition && value !== null && !loading}
        overlay={
          value === undefined ? undefined : (
            <ColorBody>
              <Translation i18nKey={positiveKey} />
            </ColorBody>
          )
        }
      >
        <BodyLarge>
          {value === undefined ? (
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
