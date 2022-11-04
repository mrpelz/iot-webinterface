import { CategoryHeader, CategoryWrapper } from '../components/category.js';
import { ComponentChild, FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';
import { useTheme } from '../state/theme.js';

export const Category: FunctionComponent<{
  header: ComponentChild;
}> = ({ children, header }) => {
  const theme = useTheme();
  const isHighContrast = useMemo(() => theme === 'highContrast', [theme]);

  return (
    <CategoryWrapper>
      <CategoryHeader isHighContrast={isHighContrast}>{header}</CategoryHeader>
      {children}
    </CategoryWrapper>
  );
};
