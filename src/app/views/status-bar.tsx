import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { api } from '../api.js';
import { StatusBar as StatusBarComponent } from '../components/status-bar.js';
import { $theme } from '../state/theme.js';
import { getSignal } from '../util/signal.js';

const $isWebSocketOnline = api.$isWebSocketOnline();

export const StatusBar: FunctionComponent = () => {
  const isWebSocketOnline = getSignal($isWebSocketOnline);
  const theme = getSignal($theme);

  const isLight = useMemo(
    () => theme === 'light' || theme === 'highContrast',
    [theme],
  );

  return (
    <StatusBarComponent isConnected={isWebSocketOnline} isLight={isLight} />
  );
};
