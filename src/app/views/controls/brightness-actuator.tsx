import {
  BinaryActuatorElement,
  isBinaryActuatorElement,
  overlayBodies,
} from './binary-actuator.js';
import {
  HierarchyElement,
  HierarchyElementPropertyActuator,
  ValueType,
  isMetaPropertyActuator,
} from '../../web-api.js';
import { NonBreaking, TabularNums } from '../../components/text.js';
import { useCallback, useMemo } from 'preact/hooks';
import {
  useChildGetter,
  useChildSetter,
  useGetter,
} from '../../state/web-api.js';
import { BlendOver } from '../../components/blend-over.js';
import { BodyLarge } from '../../components/controls.js';
import { Cell } from './main.js';
import { FunctionComponent } from 'preact';
import { I18nKey } from '../../i18n/main.js';
import { Translation } from '../../state/i18n.js';

const OverlayBody = overlayBodies.lighting;

export type BrightnessActuatorElement = BinaryActuatorElement & {
  children: {
    brightness: HierarchyElementPropertyActuator & {
      meta: { valueType: ValueType.NUMBER };
    };
  };
};

export const isBrightnessActuatorElement = (
  element: HierarchyElement
): element is BrightnessActuatorElement =>
  Boolean(
    isBinaryActuatorElement(element) &&
      element.children &&
      'brightness' in element.children &&
      isMetaPropertyActuator(element.children.brightness.meta) &&
      element.children.brightness.meta.valueType === ValueType.NUMBER
  );

export const BrightnessActuator: FunctionComponent<{
  element: BrightnessActuatorElement;
  title?: I18nKey;
}> = ({ element, title }) => {
  const { property } = element;

  const value = useGetter<boolean>(element);

  const brightness = useChildGetter<number>(element, 'brightness');
  const loading = useChildGetter<boolean>(element, 'loading');

  const flip = useChildSetter<null>(element, 'flip');
  const handleClick = useCallback(() => flip?.(null), [flip]);

  const label = useMemo(() => {
    if (value === null || brightness === null) return '?';
    if (loading) return '…';

    return (
      <NonBreaking>
        <TabularNums>{Math.round(brightness * 100)} %</TabularNums>
      </NonBreaking>
    );
  }, [brightness, loading, value]);

  return (
    <Cell
      includeBody={false}
      onClick={flip ? handleClick : undefined}
      title={<Translation i18nKey={title || property} capitalize={true} />}
    >
      <BlendOver
        blendOver={brightness === null ? 0 : brightness}
        overlay={<OverlayBody>{label}</OverlayBody>}
      >
        <BodyLarge>{label}</BodyLarge>
      </BlendOver>
    </Cell>
  );
};
