/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { add, dimension, subtract } from './style/dimensions.js';
import { color, useThemedColor } from './style/colors.js';
import { cssEnv, cssVar, useMediaQuery } from './style/main.js';
import { useBreakpointValue } from './style/breakpoint.js';
import { useTheme } from './hooks/theme.js';

export const strings = {
  get colorScheme() {
    return () => useTheme();
  },
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

const brandHue = 75;

const staticColors = {
  black: color(0, 0, 0),
  blackShaded: color(240, 17, 9),
  blue: color(211, 100, 50),
  brand: color(brandHue, 62, 52),
  greyDark: color(0, 0, 26),
  greyGlow: color(240, 9, 23),
  greyLight: color(220, 2, 76),
  greyLow: color(0, 0, 57),
  greyMid: color(0, 0, 77),
  orange: color(35, 100, 50),
  white: color(0, 100, 100),
  whiteShaded: color(240, 7, 97),
};

const themedColors = {
  backgroundPrimary: (a?: number) => () =>
    useThemedColor({ dark: staticColors.black, light: staticColors.white })(a),
  backgroundSecondary: (a?: number) => () =>
    useThemedColor({
      dark: staticColors.blackShaded,
      light: staticColors.whiteShaded,
    })(a),
  backgroundTertiary: (a?: number) => () =>
    useThemedColor({
      dark: staticColors.blackShaded,
      light: staticColors.greyLight,
    })(a),
  fontPrimary: (a?: number) => () =>
    useThemedColor({ dark: staticColors.white, light: staticColors.black })(a),
  fontSecondary: (a?: number) => () =>
    useThemedColor({
      dark: staticColors.greyLow,
      light: staticColors.greyLow,
    })(a),
  fontTertiary: (a?: number) => () =>
    useThemedColor({
      dark: staticColors.greyGlow,
      light: staticColors.greyMid,
    })(a),
  selection: (a?: number) => () =>
    useThemedColor({ dark: staticColors.orange, light: staticColors.blue })(a),
  statusBarBackground: (a?: number) => () =>
    useThemedColor({
      dark: staticColors.blackShaded,
      light: staticColors.black,
    })(a),
};

export const colors = {
  ...staticColors,
  ...themedColors,
};
