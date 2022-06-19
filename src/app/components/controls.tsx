import { StyledVNode, styled } from 'goober';
import { colors, dimensions } from '../style.js';
import { half, multiply } from '../style/dimensions.js';
import { GridCell } from './grid.js';
import { bindComponent } from '../util/combine-components.js';
import { dependentValue } from '../style/main.js';
import { forwardRef } from 'preact/compat';
import { useMemo } from 'preact/hooks';

type CellProps = {
  isHighContrast: boolean;
  onClick?: () => void;
  span: number;
};

export const Cell = bindComponent<CellProps>(
  styled(GridCell)<CellProps>`
    --background-color: ${dependentValue(
      'isHighContrast',
      colors.backgroundSecondary(),
      colors.backgroundSecondary(70)
    )};
    --border-radius: 9px;
    --border: ${dependentValue(
      'isHighContrast',
      () => `solid ${dimensions.hairline()} ${colors.fontPrimary()()}`,
      'none'
    )};

    color: ${colors.fontPrimary()};
    font-size: ${dimensions.fontSizeSmall};
    overflow: hidden;
    cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
  `,
  { isHighContrast: false, span: 2 }
);

export const Header = styled('cell-header')`
  align-items: center;
  background-color: ${colors.backgroundSecondary()};
  block-size: ${multiply(dimensions.controlBase, '4')};
  border-start-end-radius: var(--border-radius);
  border-start-start-radius: var(--border-radius);
  border: var(--border);
  display: flex;
  gap: ${dimensions.controlBase};
  justify-content: space-between;
  overflow: hidden;
  padding: ${dimensions.controlBase};
`;

export const Body = styled('cell-body' as 'section', forwardRef)`
  align-content: flex-start;
  background-color: var(--background-color, none);
  border-block-end: var(--border);
  border-end-end-radius: var(--border-radius);
  border-end-start-radius: var(--border-radius);
  border-inline-end: var(--border);
  border-inline-start: var(--border);
  display: flex;
  flex-wrap: wrap;
  gap: ${dimensions.controlBase};
  padding: ${dimensions.controlBase};
`;

export const BodyLarge = styled(Body, forwardRef)`
  font-size: ${dimensions.fontSizeLarge};
  font-weight: bold;
  justify-content: center;
`;

export const Title = styled('cell-title')`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Tag = styled('tag')`
  align-items: center;
  border-radius: ${half(dimensions.controlBase)};
  border: solid ${dimensions.hairline} ${colors.fontPrimary()};
  display: flex;
  flex-wrap: wrap;
  gap: ${dimensions.controlBase};
  min-inline-size: ${multiply(dimensions.controlBase, '3')};
  overflow: hidden;
  padding-inline: ${dimensions.controlBase};

  & > * {
    flex-shrink: 0;
  }

  &:empty {
    visibility: hidden;
  }
`;

export const TagGroup = styled('tag-group')`
  align-items: center;
  block-size: ${multiply(dimensions.controlBase, '3')};
  border-inline-end: solid ${dimensions.hairline} ${colors.fontPrimary()};
  display: flex;
  gap: ${dimensions.controlBase};
  overflow: hidden;
  padding-inline-end: ${dimensions.controlBase};

  & > * {
    flex-shrink: 0;
  }

  &:empty {
    visibility: hidden;
  }

  &:last-child {
    border-inline-end: none;
    padding-inline-end: 0;
  }
`;

// eslint-disable-next-line @typescript-eslint/ban-types
const colorBodies = <P extends Object = {}>(base: StyledVNode<P>) =>
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
  } as const);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/ban-types
export const useColorBody = <P extends Object = {}>(
  base: StyledVNode<P>,
  property?: string,
  actuated?: string
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
      if (
        lowerCaseProperty?.includes('cwhite') ||
        lowerCaseProperty?.includes('floodlight')
      ) {
        return mixedinOverlayBodies.lightingCold;
      }
      if (lowerCaseProperty?.includes('wwhite')) {
        return mixedinOverlayBodies.lighting;
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
