import { Match, TExclude } from '@iot/iot-monolith/tree';
import { FunctionComponent } from 'preact';
import { useCallback } from 'preact/hooks';

import { TSystem } from '../../../../common/types.js';
import { serialized } from '../../../api.js';
import { Tag } from '../../../components/controls.js';
import { ForwardIcon } from '../../../components/icons.js';
import { TabularNums } from '../../../components/text.js';
import { useTypedEmitter } from '../../../hooks/use-api.js';
import { useShortenedPath } from '../../../hooks/use-path.js';
import { I18nKey } from '../../../i18n/main.js';
import { setSubPath } from '../../../state/path.js';
import { Translation } from '../../../views/translation.js';
import { CellWithBody } from '../main.js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type THMMDMotionSensor = Match<
  {
    $: 'hmmdMotion';
  },
  TExclude,
  TSystem
>;

export const HMMDMotionSensor: FunctionComponent<{
  negativeKey?: I18nKey;
  onClick?: () => void;
  positiveKey?: I18nKey;
  sensor: THMMDMotionSensor;
  title?: I18nKey;
}> = ({ negativeKey = 'no', onClick, positiveKey = 'yes', sensor, title }) => {
  const { $id, $path } = serialized(sensor);

  const handleClick = useCallback(() => setSubPath($id), [$id]);

  const name_ = useShortenedPath($path);
  const name = String(
    title ?? name_?.join(' ') ?? $path?.at(-1) ?? sensor.topic,
  );

  const value = useTypedEmitter(serialized(sensor.main)).value;

  const distanceValue = useTypedEmitter(serialized(sensor.distance.main)).value;

  return (
    <CellWithBody
      icon={<ForwardIcon height="1em" />}
      title={
        <Translation
          capitalize={true}
          i18nKey={name}
        />
      }
      onClick={onClick ?? handleClick}
    >
      <Tag>
        {value === undefined ? (
          '?'
        ) : (
          <Translation i18nKey={value ? positiveKey : negativeKey} />
        )}
      </Tag>
      {distanceValue ? (
        <Tag>
          <TabularNums>{distanceValue}</TabularNums>
        </Tag>
      ) : null}
    </CellWithBody>
  );
};
