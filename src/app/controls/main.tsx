import { ComponentChild, FunctionComponent } from 'preact';

import { AnyObject } from '../api.js';
import {
  Body,
  Cell as CellComponent,
  Header,
  Title,
} from '../components/controls.js';
import { I18nKey } from '../i18n/main.js';
import { theme$ } from '../state/theme.js';
import { Actuator } from './actuators/main.js';
import { Sensor } from './sensor/main.js';

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
}) => (
  <CellComponent
    isHighContrast={theme$.value === 'highContrast'}
    span={span ?? 2}
    onClick={onClick}
  >
    <Header>
      <Title>{title}</Title>
      {icon ?? null}
    </Header>
    {children}
  </CellComponent>
);

export const CellWithBody: FunctionComponent<CellProps> = ({
  children,
  ...props
}) => (
  <Cell {...props}>
    <Body>{children}</Body>
  </Cell>
);

export const Control: FunctionComponent<{
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  object: AnyObject;
  onClick?: () => void;
  title?: I18nKey;
}> = ({ object, onClick, title }) => {
  if (!('$' in object)) return null;

  // eslint-disable-next-line new-cap
  const sensor = Sensor({ object, onClick, title });
  // eslint-disable-next-line new-cap
  const actuator = Actuator({ object, onClick, title });

  return sensor ?? actuator ?? null;
};
