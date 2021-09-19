/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { Theme, useTheme } from './hooks/theme.js';
import { add, dimension, subtract } from './style/dimensions.js';
import { color, useThemedValue } from './style/colors.js';
import { cssEnv, cssVar, useMediaQuery } from './style/main.js';
import { multiline } from './util/string.js';
import { useBreakpointValue } from './style/breakpoint.js';

export const strings = {
  get colorScheme() {
    return () => useTheme().theme;
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
  fontSize: dimension(17),
  fontSizeLarge: dimension(21),
  fontSizeSmall: dimension(14),
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
  fontPadding: `calc((${staticDimensions.titlebarHeight} - ${staticDimensions.fontSize}) / 2)`,
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
        dim: staticColors.black,
        light: staticColors.white,
      },
      themeOverride
    )(a),
  backgroundSecondary: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: staticColors.blackShaded,
        dim: staticColors.blackShaded,
        light: staticColors.whiteShaded,
      },
      themeOverride
    )(a),
  backgroundTertiary: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: staticColors.blackShaded,
        dim: staticColors.blackShaded,
        light: staticColors.greyLight,
      },
      themeOverride
    )(a),
  fontPrimary: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: staticColors.white,
        dim: staticColors.white,
        light: staticColors.black,
      },
      themeOverride
    )(a),
  fontSecondary: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: staticColors.greyLow,
        dim: staticColors.greyLow,
        light: staticColors.greyLow,
      },
      themeOverride
    )(a),
  fontTertiary: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: staticColors.greyGlow,
        dim: staticColors.greyGlow,
        light: staticColors.greyMid,
      },
      themeOverride
    )(a),
  selection: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: staticColors.orange,
        dim: staticColors.orange,
        light: staticColors.blue,
      },
      themeOverride
    )(a),
  statusBarBackground: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: staticColors.blackShaded,
        dim: staticColors.blackShaded,
        light: staticColors.black,
      },
      themeOverride
    )(a),
  surface1: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: color(brand.hue, 10, 10),
        dim: color(brand.hue, 10, 20),
        light: color(brand.hue, 25, 90),
      },
      themeOverride
    )(a),
  surface2: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: color(brand.hue, 10, 15),
        dim: color(brand.hue, 10, 25),
        light: color(brand.hue, 20, 99),
      },
      themeOverride
    )(a),
  surface3: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: color(brand.hue, 5, 20),
        dim: color(brand.hue, 5, 30),
        light: color(brand.hue, 20, 92),
      },
      themeOverride
    )(a),
  surface4: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: color(brand.hue, 5, 25),
        dim: color(brand.hue, 5, 35),
        light: color(brand.hue, 20, 85),
      },
      themeOverride
    )(a),
  surfaceShadow: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: color(brand.hue, 50, 3),
        dim: color(brand.hue, 30, 13),
        light: color(brand.hue, 10, 20),
      },
      themeOverride
    )(a),
  text1: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: color(brand.hue, 15, 85),
        dim: color(brand.hue, 15, 75),
        light: color(brand.hue, brand.saturation, 10),
      },
      themeOverride
    )(a),
  text2: (a?: number, themeOverride?: Theme) => () =>
    useThemedValue(
      {
        dark: color(brand.hue, 5, 65),
        dim: color(brand.hue, 10, 61),
        light: color(brand.hue, 30, 10),
      },
      themeOverride
    )(a),
};

export const colors = {
  ...staticColors,
  ...themedColors,
};

export const shadow = (themeOverride?: Theme) => {
  return () => {
    const shadowSurface = colors.surfaceShadow;
    const shadowStength = useThemedValue(
      {
        dark: 80,
        dim: 20,
        light: 2,
      },
      themeOverride
    );

    const result = multiline`
      0 2.8px 2.2px ${shadowSurface(shadowStength + 3)()},
      0 6.7px 5.3px ${shadowSurface(shadowStength + 1)()},
      0 12.5px 10px ${shadowSurface(shadowStength + 2)()},
      0 22.3px 17.9px ${shadowSurface(shadowStength + 2)()},
      0 41.8px 33.4px ${shadowSurface(shadowStength + 3)()},
      0 100px 80px ${shadowSurface(shadowStength)()}
    `;

    return result;
  };
};
