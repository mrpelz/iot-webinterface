import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { StatusBar as StatusBarComponent } from '../components/status-bar.js';
import { useTheme } from '../state/theme.js';
import { useStreamOnline } from '../state/web-api.js';

export const StatusBar: FunctionComponent = () => {
  const streamOnline = useStreamOnline();
  const theme = useTheme();

  const isLight = useMemo(
    () => theme === 'light' || theme === 'highContrast',
    [theme],
  );

  return <StatusBarComponent isConnected={streamOnline} isLight={isLight} />;
};
