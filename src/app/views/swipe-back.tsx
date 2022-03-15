import {
  SwipeBack as SwipeBackComponent,
  SwipeBackWrapper,
} from '../components/swipe-back.js';
import { BackIcon } from '../components/icons.js';
import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';
import { useTheme } from '../state/theme.js';

export const SwipeBack: FunctionComponent = () => {
  const theme = useTheme();
  const isHightContrast = useMemo(() => theme === 'highContrast', [theme]);

  return (
    <SwipeBackWrapper>
      <SwipeBackComponent isHighContrast={isHightContrast}>
        <BackIcon />
      </SwipeBackComponent>
    </SwipeBackWrapper>
  );
};
