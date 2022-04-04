import {
  Body,
  Cell as CellComponent,
  Header,
  Title,
} from '../../components/controls.js';
import { ForwardIcon } from '../../components/icons.js';
import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';
import { useTheme } from '../../state/theme.js';

export const Cell: FunctionComponent<{
  onClick?: () => void;
  title: string;
}> = ({ children, onClick, title }) => {
  const theme = useTheme();
  const isHighContrast = useMemo(() => theme === 'highContrast', [theme]);

  return (
    <CellComponent isHighContrast={isHighContrast} onClick={onClick}>
      <Header>
        <Title>{title}</Title>
        {onClick ? <ForwardIcon height="1em" /> : null}
      </Header>
      <Body>{children}</Body>
    </CellComponent>
  );
};
