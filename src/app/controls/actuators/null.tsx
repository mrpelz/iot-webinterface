import { Match, TExclude } from '@iot/iot-monolith/tree';
import { ensureKeys } from '@mrpelz/misc-utils/oop';
import { ButtonHTMLAttributes, FunctionComponent } from 'preact';
import { useCallback, useRef } from 'preact/hooks';

import { TSystem } from '../../../common/types.js';
import { serialized } from '../../api.js';
import { Body } from '../../components/controls.js';
import { Button } from '../../components/list.js';
import { TriggerBody } from '../../components/null-actuator.js';
import { Overlay } from '../../components/overlay.js';
import { useTypedCollector } from '../../hooks/use-api.js';
import { useColorBody } from '../../hooks/use-color-body.js';
import { useShortenedPath } from '../../hooks/use-path.js';
import { I18nKey } from '../../i18n/main.js';
import { api } from '../../main.js';
import { Translation } from '../../views/translation.js';
import { Cell } from '../main.js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type TTriggerElement = Match<
  {
    $: 'triggerElement';
  },
  TExclude,
  TSystem
>;
export type TIdentifyDevice = Match<
  {
    $: 'identifyDevice';
  },
  TExclude,
  TSystem,
  15
>;
export type TResetDevice = Match<
  {
    $: 'resetDevice';
  },
  TExclude,
  TSystem,
  15
>;

export type TNullActuator = TTriggerElement | TIdentifyDevice | TResetDevice;

export const NullActuator: FunctionComponent<{
  actuator: TNullActuator;
  onClick?: () => void;
  title?: I18nKey;
}> = ({ actuator, onClick, title }) => {
  const setter = useTypedCollector(serialized(actuator.main));

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

  const { $path } = serialized(actuator);
  const { topic } = ensureKeys(actuator, 'topic');

  const name_ = useShortenedPath($path);
  const name = String(
    title ?? name_?.join(' ') ?? $path?.at(-1) ?? actuator.topic,
  );

  const ColorBody = useColorBody(
    TriggerBody,
    String(actuator.$path?.at(-1)),
    topic,
  );

  return (
    <Cell
      title={
        <Translation
          capitalize={true}
          i18nKey={name}
        />
      }
      onClick={onClick ?? handleClick}
    >
      <Overlay
        overlay={
          // eslint-disable-next-line react-hooks/static-components
          <ColorBody ref={overlayRef}>
            <Translation i18nKey="triggered" />
          </ColorBody>
        }
      >
        <Body ref={baseRef}>
          <Translation
            capitalize={true}
            i18nKey="trigger"
          />
        </Body>
      </Overlay>
    </Cell>
  );
};

export const NullActuatorButton: FunctionComponent<
  {
    actuator:
      | TNullActuator
      | {
          main: Match<
            {
              $: 'trigger';
            },
            TExclude,
            TSystem
          >;
        };
  } & ButtonHTMLAttributes
> = ({ actuator, children, ...rest }) => {
  const setter = api.typedCollector$(actuator.main);
  const handleClick = useCallback(() => setter?.(null), [setter]);

  return (
    <Button
      onClick={handleClick}
      {...rest}
    >
      {children}
    </Button>
  );
};
