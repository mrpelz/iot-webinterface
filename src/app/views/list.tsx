import { ComponentChild, FunctionComponent } from 'preact';
import {
  Entry as EntryComponent,
  List as ListComponent,
} from '../components/list.js';
import { useMemo } from 'preact/hooks';
import { useTheme } from '../state/theme.js';

export const Entry: FunctionComponent<{
  id: string;
  label: ComponentChild;
}> = ({ children, id, label }) => {
  return (
    <EntryComponent>
      <label for={id}>{label}</label>
      {children}
    </EntryComponent>
  );
};

export const List: FunctionComponent = ({ children }) => {
  const theme = useTheme();
  const isHighContrast = useMemo(() => theme === 'highContrast', [theme]);

  return (
    <ListComponent isHighContrast={isHighContrast}>{children}</ListComponent>
  );
};