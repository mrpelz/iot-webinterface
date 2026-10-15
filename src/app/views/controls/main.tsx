import { ComponentChild, FunctionComponent, MouseEventHandler } from 'preact';

import { AnyObject } from '../../api.js';
import {
  Body,
  Cell as CellComponent,
  Header,
  Title,
} from '../../components/controls.js';
import { Marquee } from '../../components/marquee.js';
import { I18nKey } from '../../i18n/main.js';
import { theme$ } from '../../state/theme.js';
import { Actuator } from './actuators/main.js';
import { Sensor } from './sensor/main.js';

export type CellProps = {
  icon?: ComponentChild;
  onClick?: MouseEventHandler<HTMLElement>;
  span?: number;
  title: ComponentChild;
};

export const Cell: FunctionComponent<CellProps> = ({
  icon = null,
  children,
  onClick,
  span = 2,
  title,
}) => (
  <CellComponent
    isHighContrast={theme$.value === 'highContrast'}
    span={span}
    onClick={onClick}
  >
    <Header>
      <Title>
        <Marquee>{title}</Marquee>
      </Title>
      {icon}
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
