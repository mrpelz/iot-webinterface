/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { stripIndents } from 'proper-tags';

import { $theme, Theme } from './state/theme.js';
import { useBreakpointValue } from './style/breakpoint.js';
import { color, useThemedValue } from './style/colors.js';
import { add, dimension, half, subtract } from './style/dimensions.js';
import { cssEnv, cssVar, getMediaQuery } from './style/main.js';
import { getSignal } from './util/signal.js';

export const strings = {
  get colorScheme() {
    return () => getSignal($theme);
  },
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

const staticDimensions = {
  breakpointDesktop: dimension(1024),
  breakpointHuge: dimension(1440),
  breakpointTablet: dimension(640),
  controlBase: dimension(6),
  fontSize: dimension(16),
  fontSizeLarge: dimension(18),
  fontSizeSmall: dimension(14),
  gridCellWidth: dimension(75),
  menuHeight: dimension(44),
  menuWidth: dimension(200),
  titlebarHeight: dimension(44),
};

const dynamicDimensions = {
  appHeight: subtract(
    strings.viewportHeight,
    strings.safeAreaInsetTop,
    staticDimensions.titlebarHeight,
  ),
  appHeightShiftDown: subtract(
    strings.viewportHeight,
    strings.safeAreaInsetTop,
    staticDimensions.titlebarHeight,
    staticDimensions.titlebarHeight,
  ),
  get appWidth() {
    return () =>
      useBreakpointValue(
        getMediaQuery(staticDimensions.breakpointDesktop),
        subtract('100%', staticDimensions.menuWidth),
        '100%',
      );
  },
  fontPadding: half(
    subtract(staticDimensions.titlebarHeight, staticDimensions.fontSize),
  ),
  get fontSizeLargeAdaptive() {
    return () =>
      useBreakpointValue(
        getMediaQuery(staticDimensions.breakpointDesktop),
        staticDimensions.fontSizeLarge,
        staticDimensions.fontSize,
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
    staticDimensions.titlebarHeight,
  ),
};

export const dimensions = {
  ...staticDimensions,
  ...dynamicDimensions,
};

const brand = {
  hue: 35,
  lightness: 50,
  saturation: 100,
};

const staticColors = {
  black: color(0, 0, 0),
  blackShaded: color(240, 17, 9),
  blue: color(211, 100, 50),
  greyDark: color(0, 0, 26),
  greyGlow: color(240, 9, 23),
  greyLight: color(220, 2, 76),
  greyLow: color(0, 0, 57),
  greyMid: color(0, 0, 77),
  orange: color(brand.hue, brand.saturation, brand.lightness),
  white: color(0, 100, 100),
  whiteShaded: color(240, 7, 97),
};

const themedColors = {
  backgroundPrimary: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: staticColors.black,
        highContrast: staticColors.white,
        light: staticColors.white,
      },
      themeOverride,
    )(a),
  backgroundSecondary: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: staticColors.blackShaded,
        highContrast: staticColors.white,
        light: staticColors.whiteShaded,
      },
      themeOverride,
    )(a),
  backgroundTertiary: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: staticColors.blackShaded,
        highContrast: staticColors.white,
        light: staticColors.greyLight,
      },
      themeOverride,
    )(a),
  fontPrimary: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: staticColors.white,
        highContrast: staticColors.black,
        light: staticColors.black,
      },
      themeOverride,
    )(a),
  fontSecondary: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: staticColors.greyLow,
        highContrast: staticColors.black,
        light: staticColors.greyLow,
      },
      themeOverride,
    )(a),
  fontTertiary: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: staticColors.greyGlow,
        highContrast: staticColors.black,
        light: staticColors.greyMid,
      },
      themeOverride,
    )(a),
  selection: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: staticColors.orange,
        highContrast: staticColors.black,
        light: staticColors.blue,
      },
      themeOverride,
    )(a),
  statusBarBackground: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: staticColors.blackShaded,
        highContrast: staticColors.black,
        light: staticColors.black,
      },
      themeOverride,
    )(a),
  surface0: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: color(brand.hue, 10, 5),
        highContrast: color(brand.hue, 10, 15),
        light: color(brand.hue, 25, 70),
      },
      themeOverride,
    )(a),
  surface1: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: color(brand.hue, 10, 10),
        highContrast: color(brand.hue, 10, 20),
        light: color(brand.hue, 25, 90),
      },
      themeOverride,
    )(a),
  surface2: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: color(brand.hue, 10, 15),
        highContrast: color(brand.hue, 10, 25),
        light: color(brand.hue, 20, 99),
      },
      themeOverride,
    )(a),
  surface3: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: color(brand.hue, 5, 20),
        highContrast: color(brand.hue, 5, 30),
        light: color(brand.hue, 20, 92),
      },
      themeOverride,
    )(a),
  surface4: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: color(brand.hue, 5, 25),
        highContrast: color(brand.hue, 5, 35),
        light: color(brand.hue, 20, 85),
      },
      themeOverride,
    )(a),
  surfaceShadow: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: color(brand.hue, 50, 3),
        highContrast: color(brand.hue, 30, 13),
        light: color(brand.hue, 10, 20),
      },
      themeOverride,
    )(a),
  text1: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: color(brand.hue, 15, 85),
        highContrast: color(brand.hue, 15, 75),
        light: color(brand.hue, brand.saturation, 10),
      },
      themeOverride,
    )(a),
  text2: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: color(brand.hue, 5, 65),
        highContrast: color(brand.hue, 10, 61),
        light: color(brand.hue, 30, 10),
      },
      themeOverride,
    )(a),
};

export const colors = {
  ...staticColors,
  ...themedColors,
};

export const shadow = (themeOverride?: Theme) => () => {
  const shadowSurface = colors.surfaceShadow;
  const shadowStength = useThemedValue(
    {
      dark: 80,
      highContrast: 20,
      light: 2,
    },
    themeOverride,
  );

  const result = stripIndents`
    0 2.8px 2.2px ${shadowSurface(shadowStength + 3)()},
    0 6.7px 5.3px ${shadowSurface(shadowStength + 1)()},
    0 12.5px 10px ${shadowSurface(shadowStength + 2)()},
    0 22.3px 17.9px ${shadowSurface(shadowStength + 2)()},
    0 41.8px 33.4px ${shadowSurface(shadowStength + 3)()},
    0 100px 80px ${shadowSurface(shadowStength)()}
  `;

  return result;
};
