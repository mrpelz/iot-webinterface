import { ComponentChild, FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import {
  Body,
  Cell as CellComponent,
  Header,
  Title,
} from '../components/controls.js';
import { I18nKey } from '../i18n/main.js';
import { $theme } from '../state/theme.js';
import {
  HierarchyElementArea,
  HierarchyElementProperty,
  HierarchyElementPropertyActuator,
  HierarchyElementPropertySensor,
  isMetaPropertyActuator,
  isMetaPropertySensor,
} from '../web-api.js';
import { Actuator } from './actuators/main.js';
import { isRGBActuatorElement, RGBActuator } from './actuators/rgb.js';
import { Sensor } from './sensor/main.js';
import { isOpenSensorElement, OpenSensor } from './sensor/open.js';
import { isTimerActuatorElement, TimerActuator } from './timer.js';

export type CellProps = {
  icon?: ComponentChild;
  onClick?: () => void;
  span?: number;
  title: ComponentChild;
};

export const Cell: FunctionComponent<CellProps> = ({
  icon,
  children,
  onClick,
  span,
  title,
}) => {
  const { value: theme } = $theme;
  const isHighContrast = useMemo(() => theme === 'highContrast', [theme]);

  const props = useMemo(
    () => ({
      isHighContrast,
      onClick,
      ...(span ? { span } : {}),
    }),
    [isHighContrast, onClick, span],
  );

  return (
    <CellComponent {...props}>
      <Header>
        <Title>{title}</Title>
        {icon && onClick ? icon : null}
      </Header>
      {children}
    </CellComponent>
  );
};

export const CellWithBody: FunctionComponent<CellProps> = ({
  children,
  ...props
}) => (
  <Cell {...props}>
    <Body>{children}</Body>
  </Cell>
);

export const Control: FunctionComponent<{
  element: HierarchyElementProperty | HierarchyElementArea;
  onClick?: () => void;
  title?: I18nKey;
}> = ({ element, onClick, title }) => {
  if (isTimerActuatorElement(element)) {
    return <TimerActuator element={element} onClick={onClick} title={title} />;
  }

  if (isOpenSensorElement(element)) {
    return <OpenSensor element={element} onClick={onClick} title={title} />;
  }

  if (isRGBActuatorElement(element)) {
    return <RGBActuator element={element} onClick={onClick} title={title} />;
  }

  if (isMetaPropertySensor(element.meta)) {
    return (
      <Sensor
        element={element as HierarchyElementPropertySensor}
        onClick={onClick}
        title={title}
      />
    );
  }

  if (isMetaPropertyActuator(element.meta)) {
    return (
      <Actuator
        element={element as HierarchyElementPropertyActuator}
        onClick={onClick}
        title={title}
      />
    );
  }

  return null;
};
