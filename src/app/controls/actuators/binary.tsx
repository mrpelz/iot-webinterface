import { Match, TExclude } from '@iot/iot-monolith/tree';
import { ensureKeys } from '@mrpelz/misc-utils/oop';
import { FunctionComponent, MouseEventHandler } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';

import { TSystem } from '../../../common/types.js';
import { serialized } from '../../api.js';
import { BlendOver } from '../../components/blend-over.js';
import { BodyLarge } from '../../components/controls.js';
import { ForwardIcon } from '../../components/icons.js';
import { useTypedCollector, useTypedEmitter } from '../../hooks/use-api.js';
import { useColorBody } from '../../hooks/use-color-body.js';
import { useDelay } from '../../hooks/use-delay.js';
import { useShortenedPath } from '../../hooks/use-path.js';
import { I18nKey } from '../../i18n/main.js';
import { rootPath$, setSubPath } from '../../state/path.js';
import { Translation } from '../../views/translation.js';
import { Cell } from '../main.js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type TBinaryActuator = Match<
  {
    $: 'output' | 'outputGrouping' | 'scene';
  },
  TExclude,
  TSystem
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
  // eslint-disable-next-line complexity
}) => {
  const value = useTypedEmitter(serialized(actuator.main));

  const loading_ = useMemo(
    () => ensureKeys(actuator, 'actuatorStaleness'),
    [actuator],
  )?.actuatorStaleness?.loading;

  const loading = useTypedEmitter(
    loading_ ? serialized(loading_) : undefined,
  ).value;

  const { $id, $path } = serialized(actuator);
  const handleClick = useCallback(() => setSubPath($id), [$id]);

  const flip = useTypedCollector(serialized(actuator.flip));
  const handleBodyClick = useCallback<MouseEventHandler<HTMLElement>>(
    (event) => {
      event.stopPropagation();

      if (onClick) {
        onClick();
        return;
      }

      flip?.(null);
    },
    [flip, onClick],
  );

  const name_ = useShortenedPath($path);
  const name = String(
    title ?? name_?.join(' ') ?? $path?.at(-1) ?? actuator.topic,
  );

  const ColorBody = useColorBody(
    BodyLarge,
    String($path?.at(-1)),
    actuator.topic,
  );

  const allowTransition = Boolean(useDelay(rootPath$.value, 300, true));

  const { value: value_ } = value;

  const isGrouping = actuator.$ === 'outputGrouping';

  return (
    <Cell
      icon={isGrouping ? <ForwardIcon height="1em" /> : undefined}
      title={
        <Translation
          capitalize={true}
          i18nKey={name}
        />
      }
      onClick={isGrouping ? handleClick : handleBodyClick}
    >
      <BlendOver
        blendOver={value_ ? 1 : 0}
        direction="block"
        transition={allowTransition && value_ !== null && !loading}
        overlay={
          value_ === undefined ? undefined : (
            // eslint-disable-next-line react-hooks/static-components
            <ColorBody>
              <Translation i18nKey={positiveKey} />
            </ColorBody>
          )
        }
        onClick={isGrouping ? handleBodyClick : undefined}
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
