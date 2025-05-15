import { cssEnv, cssVar } from './main.js';

export const staticStrings = {
  font: '-apple-system, SF UI Text, Helvetica Neue, Helvetica, Arial, sans-serif',
  isRetina: '(-webkit-min-device-pixel-ratio: 2)',
  prefersDarkTheme: '(prefers-color-scheme: dark)',
  prefersLightTheme: '(prefers-color-scheme: light)',
  prefersMoreContrast: '(prefers-contrast: more)',
  safeAreaInsetTop: cssVar(
    'safe-area-inset-top',
    cssEnv('safe-area-inset-top'),
  ),
  translucent: cssVar('translucent', '20px'),
  viewportHeight: '100vh',
};
