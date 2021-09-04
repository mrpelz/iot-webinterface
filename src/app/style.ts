import { add, dimension, subtract } from './style/dimensions.js';
import { cssEnv, cssVar, useMediaQuery } from './style/main.js';
import { color } from './style/colors.js';
import { useBreakpointValue } from './style/breakpoint.js';

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

const staticDimensions = {
  breakpoint: dimension(1024),
  menuHeight: dimension(44),
  menuWidth: dimension(200),
  titlebarHeight: dimension(44),
};

const dynamicDimensions = {
  appHeight: subtract(
    strings.viewportHeight,
    strings.safeAreaInsetTop,
    staticDimensions.titlebarHeight
  ),
  appHeightShiftDown: subtract(
    strings.viewportHeight,
    strings.safeAreaInsetTop,
    staticDimensions.titlebarHeight,
    staticDimensions.titlebarHeight
  ),
  get appWidth() {
    return () =>
      useBreakpointValue(
        useMediaQuery(staticDimensions.breakpoint),
        subtract(strings.viewportWidth, staticDimensions.menuWidth),
        strings.viewportWidth
      );
  },
  get hairline() {
    return () =>
      useBreakpointValue(strings.isRetina, dimension(0.5), dimension(1));
  },
  headerHeight: add(strings.safeAreaInsetTop, staticDimensions.titlebarHeight),
  headerHeightShiftDown: add(
    strings.safeAreaInsetTop,
    staticDimensions.titlebarHeight,
    staticDimensions.titlebarHeight
  ),
};

export const dimensions = {
  ...staticDimensions,
  ...dynamicDimensions,
};

export const colors = {
  black: color(0, 0, 0),
  blackShaded: color(240, 17, 9),
  blue: color(211, 100, 50),
  greyDark: color(0, 0, 26),
  greyGlow: color(240, 9, 23),
  greyLight: color(220, 2, 76),
  greyLow: color(0, 0, 57),
  greyMid: color(0, 0, 77),
  orange: color(35, 100, 50),
  white: color(0, 100, 100),
  whiteShaded: color(240, 7, 97),
};

export const themes = {
  dark: {
    backgroundPrimary: colors.black,
    backgroundSecondary: colors.blackShaded,
    backgroundTertiary: colors.blackShaded,
    fontPrimary: colors.white,
    fontSecondary: colors.greyLow,
    fontTertiary: colors.greyGlow,
    selection: colors.orange,
    statusBarBackground: colors.blackShaded,
  } as const,
  light: {
    backgroundPrimary: colors.white,
    backgroundSecondary: colors.whiteShaded,
    backgroundTertiary: colors.greyLight,
    fontPrimary: colors.black,
    fontSecondary: colors.greyLow,
    fontTertiary: colors.greyMid,
    selection: colors.blue,
    statusBarBackground: colors.black,
  } as const,
};
