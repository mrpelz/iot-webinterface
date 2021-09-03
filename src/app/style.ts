import { add, dimension, subtract } from './style/dimensions.js';
import { cssEnv, cssVar, string } from './style/main.js';
import { breakpointValue } from './style/breakpoint.js';

export const dimensions = {
  breakpoint: 1024,
  menuHeight: 44,
  menuWidth: 200,
  titlebarHeight: 44,
};

export const strings = {
  font: '-apple-system, SF UI Text, Helvetica Neue, Helvetica, Arial, sans-serif',
  isRetina: '(-webkit-min-device-pixel-ratio: 2)',
  prefersDarkTheme: '(prefers-color-scheme: dark)',
  prefersLightTheme: '(prefers-color-scheme: light)',
  safeAreaInsetTop: cssVar(
    'safe-area-inset-top',
    cssEnv('safe-area-inset-top')
  ),
  translucent: cssVar('translucent', '20px'),
  viewportHeight: '100vh',
  viewportWidth: '100vw',
};

export const colors = {
  black: [0, 0, 0],
  blackShaded: [240, 17, 9],
  blue: [211, 100, 50],
  greyDark: [0, 0, 26],
  greyGlow: [240, 9, 23],
  greyLight: [220, 2, 76],
  greyLow: [0, 0, 57],
  greyMid: [0, 0, 77],
  orange: [35, 100, 50],
  white: [0, 100, 100],
  whiteShaded: [240, 7, 97],
};

export const themes = {
  dark: {
    backgroundPrimary: 'black',
    backgroundSecondary: 'blackShaded',
    backgroundTertiary: 'blackShaded',
    fontPrimary: 'white',
    fontSecondary: 'greyLow',
    fontTertiary: 'greyGlow',
    selection: 'orange',
    statusBarBackground: 'blackShaded',
  },
  light: {
    backgroundPrimary: 'white',
    backgroundSecondary: 'whiteShaded',
    backgroundTertiary: 'greyLight',
    fontPrimary: 'black',
    fontSecondary: 'greyLow',
    fontTertiary: 'greyMid',
    selection: 'blue',
    statusBarBackground: 'black',
  },
};

export const hairline = (): (() => string) =>
  breakpointValue(string('isRetina'), '0.5px', '1px');

export const appWidthDesktop = (): (() => string) => {
  return subtract(string('viewportWidth'), dimension('menuWidth'));
};

export const appWidthMobile = (): (() => string) => {
  return string('viewportWidth');
};

export const appHeight = (): (() => string) => {
  return subtract(
    string('viewportHeight'),
    string('safeAreaInsetTop'),
    dimension('titlebarHeight')
  );
};

export const appHeightShiftDown = (): (() => string) => {
  return subtract(
    string('viewportHeight'),
    string('safeAreaInsetTop'),
    dimension('titlebarHeight'),
    dimension('titlebarHeight')
  );
};

export const headerHeight = (): (() => string) => {
  return add(string('safeAreaInsetTop'), dimension('titlebarHeight'));
};

export const headerHeightShiftDown = (): (() => string) => {
  return add(
    string('safeAreaInsetTop'),
    dimension('titlebarHeight'),
    dimension('titlebarHeight')
  );
};
