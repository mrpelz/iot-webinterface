import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { BackIcon } from '../components/icons.js';
import {
  SwipeBack as SwipeBackComponent,
  SwipeBackWrapper,
} from '../components/swipe-back.js';
import { useTheme } from '../state/theme.js';

export const SwipeBack: FunctionComponent = () => {
  const theme = useTheme();
  const isHighContrast = useMemo(() => theme === 'highContrast', [theme]);

  return (
    <SwipeBackWrapper>
      <SwipeBackComponent isHighContrast={isHighContrast}>
        <BackIcon />
      </SwipeBackComponent>
    </SwipeBackWrapper>
  );
};
