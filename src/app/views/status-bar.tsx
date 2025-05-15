import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { StatusBar as StatusBarComponent } from '../components/status-bar.js';
import { api } from '../main.js';
import { $theme } from '../state/theme.js';

const $isWebSocketOnline = api.$isWebSocketOnline();

export const StatusBar: FunctionComponent = () => {
  const isWebSocketOnline = $isWebSocketOnline.value;
  const theme = $theme.value;

  const isLight = useMemo(
    () => theme === 'light' || theme === 'highContrast',
    [theme],
  );

  return (
    <StatusBarComponent isConnected={isWebSocketOnline} isLight={isLight} />
  );
};
