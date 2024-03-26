import { ComponentChild, FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { CategoryHeader, CategoryWrapper } from '../components/category.js';
import { $theme } from '../state/theme.js';
import { getSignal } from '../util/signal.js';

export const Category: FunctionComponent<{
  header: ComponentChild;
}> = ({ children, header }) => {
  const theme = getSignal($theme);
  const isHighContrast = useMemo(() => theme === 'highContrast', [theme]);

  return (
    <CategoryWrapper>
      <CategoryHeader isHighContrast={isHighContrast}>{header}</CategoryHeader>
      {children}
    </CategoryWrapper>
  );
};
