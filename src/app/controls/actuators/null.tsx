import { ensureKeys } from '@iot/iot-monolith/oop';
import { Match, TExclude } from '@iot/iot-monolith/tree';
import { FunctionComponent } from 'preact';
import { useCallback, useRef } from 'preact/hooks';

import { TSerialization } from '../../../common/types.js';
import { Body } from '../../components/controls.js';
import { Button } from '../../components/list.js';
import { TriggerBody } from '../../components/null-actuator.js';
import { Overlay } from '../../components/overlay.js';
import { useColorBody } from '../../hooks/use-color-body.js';
import { I18nKey } from '../../i18n/main.js';
import { api } from '../../main.js';
import { useTypedCollector } from '../../state/api.js';
import { Translation } from '../../views/translation.js';
import { Cell } from '../main.js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type TTriggerElement = Match<
  {
    $: 'triggerElement';
  },
  TExclude,
  TSerialization
>;
export type TIdentifyDevice = Match<
  {
    $: 'identifyDevice';
  },
  TExclude,
  TSerialization,
  15
>;
export type TResetDevice = Match<
  {
    $: 'resetDevice';
  },
  TExclude,
  TSerialization,
  15
>;

export type TNullActuator = TTriggerElement | TIdentifyDevice | TResetDevice;

export const NullActuator: FunctionComponent<{
  actuator: TNullActuator;
  onClick?: () => void;
  title?: I18nKey;
}> = ({ actuator, onClick, title }) => {
  const setter = useTypedCollector(actuator.main);

  const overlayRef = useRef<HTMLElement>(null);
  const baseRef = useRef<HTMLElement>(null);

  const handleClick = useCallback(() => {
    const { current: overlay } = overlayRef;
    const { current: base } = baseRef;

    setter(null);

    if (!(overlay instanceof HTMLElement)) return;
    if (!(base instanceof HTMLElement)) return;

    (async () => {
      const [animationBase, animationOverlay] = await Promise.all([
        base.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 1000,
          easing: 'ease-out',
        }).finished,
        overlay.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 1000,
          easing: 'ease-out',
        }).finished,
      ]);

      animationBase.finish();
      animationOverlay.finish();
    })();
  }, [setter]);

  const { topic } = ensureKeys(actuator, 'topic');

  const ColorBody = useColorBody(
    TriggerBody,
    String(actuator.$path?.at(-1)),
    topic,
  );

  return (
    <Cell
      onClick={onClick ?? handleClick}
      title={<Translation i18nKey="scene" capitalize={true} />}
    >
      <Overlay
        overlay={
          <ColorBody ref={overlayRef}>
            <Translation i18nKey="triggered" />
          </ColorBody>
        }
      >
        <Body ref={baseRef}>
          <Translation
            i18nKey={title ?? topic ?? 'trigger'}
            capitalize={true}
          />
        </Body>
      </Overlay>
    </Cell>
  );
};

export const NullActuatorButton: FunctionComponent<{
  actuator: TNullActuator;
}> = ({ actuator, children }) => {
  const setter = api.$typedCollector(actuator.main);
  const handleClick = useCallback(() => setter?.(null), [setter]);

  return <Button onClick={handleClick}>{children}</Button>;
};
