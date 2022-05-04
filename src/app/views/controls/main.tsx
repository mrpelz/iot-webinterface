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

export const Cell: FunctionComponent<{
  arrow?: boolean;
  onClick?: () => void;
  title: ComponentChild;
}> = ({ arrow, children, onClick, title }) => {
  const theme = useTheme();
  const isHighContrast = useMemo(() => theme === 'highContrast', [theme]);

  return (
    <CellComponent isHighContrast={isHighContrast} onClick={onClick}>
      <Header>
        <Title>{title}</Title>
        {arrow && onClick ? <ForwardIcon height="1em" /> : null}
      </Header>
      <Body>{children}</Body>
    </CellComponent>
  );
};
