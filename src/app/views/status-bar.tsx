import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { StatusBar as StatusBarComponent } from '../components/status-bar.js';
import { useIsWebSocketOnline } from '../state/api.js';
import { useTheme } from '../state/theme.js';

export const StatusBar: FunctionComponent = () => {
  const isWebSocketOnline = useIsWebSocketOnline();
  const theme = useTheme();

  const isLight = useMemo(
    () => theme === 'light' || theme === 'highContrast',
    [theme],
  );

  return (
    <StatusBarComponent
      isConnected={isWebSocketOnline.value}
      isLight={isLight}
    />
  );
};
