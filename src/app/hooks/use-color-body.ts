import { styled, StyledVNode } from 'goober';
import { forwardRef } from 'preact/compat';
import { useMemo } from 'preact/hooks';

import { colors } from '../style.js';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
const colorBodies = <P extends object = {}>(base: StyledVNode<P>) =>
  ({
    _: styled(base, forwardRef)`
      background-color: ${colors.whiteShaded(80)};
      color: ${colors.fontPrimary(undefined, 'light')};
    `,
    fan: styled(base, forwardRef)`
      background-color: hsla(200deg 100% 50% / 80%);
      color: ${colors.fontPrimary(undefined, 'light')};
    `,
    lighting: styled(base, forwardRef)`
      background-color: hsla(40deg 100% 50% / 80%);
      color: ${colors.fontPrimary(undefined, 'light')};
    `,
    lightingBlue: styled(base, forwardRef)`
      background-color: hsl(240deg 100% 50% / 80%);
      color: ${colors.fontPrimary(undefined, 'dark')};
    `,
    lightingCold: styled(base, forwardRef)`
      background-color: hsl(60deg 100% 60% / 80%);
      color: ${colors.fontPrimary(undefined, 'light')};
    `,
    lightingGreen: styled(base, forwardRef)`
      background-color: hsl(120deg 100% 50% / 80%);
      color: ${colors.fontPrimary(undefined, 'light')};
    `,
    lightingRed: styled(base, forwardRef)`
      background-color: hsl(0deg 100% 50% / 80%);
      color: ${colors.fontPrimary(undefined, 'light')};
    `,
    lightingWarm: styled(base, forwardRef)`
      background-color: hsl(30deg 100% 50% / 80%);
      color: ${colors.fontPrimary(undefined, 'light')};
    `,
  }) as const;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const useColorBody = <P extends object = {}>(
  base: StyledVNode<P>,
  property?: string,
  actuated?: string,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
) => {
  const component = useMemo(() => {
    const mixedinOverlayBodies = colorBodies(base);

    if (actuated === 'lighting') {
      const lowerCaseProperty = property?.toLowerCase();

      if (lowerCaseProperty?.includes('red') || lowerCaseProperty === 'r') {
        return mixedinOverlayBodies.lightingRed;
      }
      if (lowerCaseProperty?.includes('green') || lowerCaseProperty === 'g') {
        return mixedinOverlayBodies.lightingGreen;
      }
      if (lowerCaseProperty?.includes('blue') || lowerCaseProperty === 'b') {
        return mixedinOverlayBodies.lightingBlue;
      }
      if (lowerCaseProperty?.includes('cwhite')) {
        return mixedinOverlayBodies.lightingCold;
      }
      if (lowerCaseProperty?.includes('wwhite')) {
        return mixedinOverlayBodies.lightingWarm;
      }
    }

    if (property && property in mixedinOverlayBodies) {
      return mixedinOverlayBodies[
        property as keyof typeof mixedinOverlayBodies
      ];
    }

    if (actuated && actuated in mixedinOverlayBodies) {
      return mixedinOverlayBodies[
        actuated as keyof typeof mixedinOverlayBodies
      ];
    }

    return mixedinOverlayBodies._;
  }, [actuated, base, property]);

  return component;
};
