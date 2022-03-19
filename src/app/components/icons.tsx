import { FunctionComponent } from 'preact';
import { styled } from 'goober';

const SVG = styled('svg')`
  fill: none;
  max-height: 100%;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
  stroke: currentColor;

  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
`;

export const BackIcon: FunctionComponent<JSX.SVGAttributes<SVGSVGElement>> = (
  props
) => (
  // https://feathericons.com
  <SVG {...props} viewBox="8 5 8 14">
    <polyline points="15 18 9 12 15 6" />
  </SVG>
);

export const MapIcon: FunctionComponent<JSX.SVGAttributes<SVGSVGElement>> = (
  props
) => (
  // https://feathericons.com
  <SVG {...props} viewBox="0 0 24 24">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" />
    <line x1="16" y1="6" x2="16" y2="22" />
  </SVG>
);

export const MenuIcon: FunctionComponent<JSX.SVGAttributes<SVGSVGElement>> = (
  props
) => (
  // https://feathericons.com
  <SVG {...props} viewBox="2 5 20 14">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </SVG>
);

export const ReturnIcon: FunctionComponent<JSX.SVGAttributes<SVGSVGElement>> = (
  props
) => (
  // https://feathericons.com
  <SVG {...props} viewBox="2 0 20 24">
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </SVG>
);

const WaitIconOuter = styled(SVG)`
  animation: 2s linear infinite wait-outer-animation;

  @keyframes wait-outer-animation {
    0% {
      transform: rotateZ(0deg);
    }
    100% {
      transform: rotateZ(360deg);
    }
  }
`;

const WaitIconInner = styled('circle')`
  animation: 1.4s ease-in-out infinite both wait-circle-animation;
  fill: transparent;
  stroke-dasharray: 283;
  stroke-dashoffset: 75;
  stroke-width: 10;
  transform-origin: 50% 50%;

  @keyframes wait-circle-animation {
    0%,
    25% {
      stroke-dashoffset: 280;
      transform: rotate(0);
    }

    50%,
    75% {
      stroke-dashoffset: 75;
      transform: rotate(45deg);
    }

    100% {
      stroke-dashoffset: 280;
      transform: rotate(360deg);
    }
  }
`;

export const WaitIcon: FunctionComponent<JSX.SVGAttributes<SVGSVGElement>> = (
  props
) => (
  <WaitIconOuter {...props} viewBox="0 0 100 100">
    <WaitIconInner cx="50" cy="50" r="45" />
  </WaitIconOuter>
);
