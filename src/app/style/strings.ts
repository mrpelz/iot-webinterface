import { cssEnv, cssVar } from './main.js';

export const staticStrings = {
  font: '-apple-system, SF UI Text, Helvetica Neue, Helvetica, Arial, sans-serif',
  isRetina2x: '(-webkit-min-device-pixel-ratio: 2)',
  isRetina3x: '(-webkit-min-device-pixel-ratio: 3)',
  prefersDarkTheme: '(prefers-color-scheme: dark)',
  prefersLightTheme: '(prefers-color-scheme: light)',
  prefersMoreContrast: '(prefers-contrast: more)',
  safeAreaInsetBottom: cssVar(
    'safe-area-inset-bottom',
    cssEnv('safe-area-inset-bottom'),
  ),
  safeAreaInsetTop: cssVar(
    'safe-area-inset-top',
    cssEnv('safe-area-inset-top'),
  ),
  translucent: cssVar('translucent', '20px'),
  viewportHeightLargest: '100lvh',
  viewportHeightSmallest: '100svh',
};
