import { ensureKeys } from '@iot/iot-monolith/oop';
import { Match, TExclude } from '@iot/iot-monolith/tree';
import { FunctionComponent } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';

import { TSerialization } from '../../../common/types.js';
import { BlendOver } from '../../components/blend-over.js';
import { BodyLarge } from '../../components/controls.js';
import { useColorBody } from '../../hooks/use-color-body.js';
import { useDelay } from '../../hooks/use-delay.js';
import { I18nKey } from '../../i18n/main.js';
import { useTypedCollector, useTypedEmitter } from '../../state/api.js';
import { $rootPath } from '../../state/path.js';
import { Translation } from '../../views/translation.js';
import { Cell } from '../main.js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type TBinaryActuator = Match<
  {
    $: 'output' | 'outputGrouping' | 'scene';
  },
  TExclude,
  TSerialization
>;

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
  const value = useTypedEmitter(actuator.main);

  const loading = useTypedEmitter(
    useMemo(() => ensureKeys(actuator, 'actuatorStaleness'), [actuator])
      ?.actuatorStaleness?.loading,
  ).value;

  const flip = useTypedCollector(actuator.flip);
  const handleClick = useCallback(() => flip?.(null), [flip]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const name = String(title ?? actuator.$path?.at(-1) ?? actuator.topic);

  const ColorBody = useColorBody(
    BodyLarge,
    String(actuator.$path?.at(-1)),
    actuator.topic,
  );

  const allowTransition = Boolean(useDelay($rootPath.value, 300, true));

  const { value: value_ } = value;

  return (
    <Cell
      onClick={onClick ?? handleClick}
      title={<Translation i18nKey={name} capitalize={true} />}
    >
      <BlendOver
        blendOver={value_ ? 1 : 0}
        direction="block"
        transition={allowTransition && value_ !== null && !loading}
        overlay={
          value_ === undefined ? undefined : (
            <ColorBody>
              <Translation i18nKey={positiveKey} />
            </ColorBody>
          )
        }
      >
        <BodyLarge>
          {value_ === undefined ? (
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
