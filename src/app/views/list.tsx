import { ComponentChild, FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import {
  Entry as EntryComponent,
  List as ListComponent,
} from '../components/list.js';
import { $theme } from '../state/theme.js';
import { getSignal } from '../util/signal.js';

export const Entry: FunctionComponent<{
  id?: string;
  label?: ComponentChild;
}> = ({ children, id, label }) => (
  <EntryComponent>
    {label ? <label for={id}>{label}</label> : null}
    {children}
  </EntryComponent>
);

export const List: FunctionComponent = ({ children }) => {
  const theme = getSignal($theme);
  const isHighContrast = useMemo(() => theme === 'highContrast', [theme]);

  return (
    <ListComponent isHighContrast={isHighContrast}>{children}</ListComponent>
  );
};
