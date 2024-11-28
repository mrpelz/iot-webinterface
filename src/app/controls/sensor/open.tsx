import { FunctionComponent } from 'preact';
import { useCallback } from 'preact/hooks';

import { Match } from '../../api.js';
import { Tag } from '../../components/controls.js';
import { ForwardIcon } from '../../components/icons.js';
import { useTypedEmitter } from '../../hooks/use-interaction.js';
import { I18nKey } from '../../i18n/main.js';
import { $setSubPath } from '../../state/path.js';
import { getSignal } from '../../util/signal.js';
import { Translation } from '../../views/translation.js';
import { CellWithBody } from '../main.js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type TWindowSensor = Match<{ $: 'window' }>;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type TDoorSensor = Match<{ $: 'door' }>;

export type TOpenSensor = TWindowSensor | TDoorSensor;

export const OpenSensor: FunctionComponent<{
  negativeKey?: I18nKey;
  onClick?: () => void;
  positiveKey?: I18nKey;
  sensor: TOpenSensor;
  title?: I18nKey;
}> = ({
  negativeKey = 'closed',
  onClick,
  positiveKey = 'open',
  sensor,
  title,
}) => {
  const {
    $ref: { id },
  } = sensor;

  const handleClick = useCallback(() => getSignal($setSubPath)(id), [id]);

  const value = useTypedEmitter(sensor.open.main).value;

  return (
    <CellWithBody
      icon={<ForwardIcon height="1em" />}
      onClick={onClick ?? handleClick}
      title={<Translation i18nKey={title || sensor.$} capitalize={true} />}
    >
      <Tag>
        {value === null ? (
          '?'
        ) : (
          <Translation i18nKey={value ? positiveKey : negativeKey} />
        )}
      </Tag>
    </CellWithBody>
  );
};
