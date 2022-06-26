import {
  Body,
  Cell as CellComponent,
  Header,
  Title,
} from '../../components/controls.js';
import { ComponentChild, FunctionComponent } from 'preact';
import { ForwardIcon } from '../../components/icons.js';
import { useMemo } from 'preact/hooks';
import { useTheme } from '../../state/theme.js';

export type CellProps = {
  arrow?: boolean;
  onClick?: () => void;
  title: ComponentChild;
};

export const Cell: FunctionComponent<CellProps> = ({
  arrow,
  children,
  onClick,
  title,
}) => {
  const theme = useTheme();
  const isHighContrast = useMemo(() => theme === 'highContrast', [theme]);

  return (
    <CellComponent isHighContrast={isHighContrast} onClick={onClick}>
      <Header>
        <Title>{title}</Title>
        {arrow && onClick ? <ForwardIcon height="1em" /> : null}
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
