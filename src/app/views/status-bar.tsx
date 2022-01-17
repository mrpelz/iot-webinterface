import { FunctionComponent } from 'preact';
import { StatusBar as StatusBarComponent } from '../components/status-bar.js';
import { useStreamOnline } from '../state/web-api.js';
import { useTheme } from '../state/theme.js';

export const StatusBar: FunctionComponent = () => {
  const streamOnline = useStreamOnline();
  const theme = useTheme();

  return (
    <StatusBarComponent
      isConnected={streamOnline}
      isLight={theme === 'light'}
    />
  );
};
