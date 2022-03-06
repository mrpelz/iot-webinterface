import { FunctionComponent } from 'preact';
import { StatusBar as StatusBarComponent } from '../components/status-bar.js';
import { useMemo } from 'preact/hooks';
import { useStreamOnline } from '../state/web-api.js';
import { useTheme } from '../state/theme.js';

export const StatusBar: FunctionComponent = () => {
  const streamOnline = useStreamOnline();
  const theme = useTheme();

  const isLight = useMemo(
    () => theme === 'light' || theme === 'highContrast',
    [theme]
  );

  return <StatusBarComponent isConnected={streamOnline} isLight={isLight} />;
};
