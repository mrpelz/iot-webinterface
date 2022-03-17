import { FunctionComponent } from 'preact';
import { styled } from 'goober';

const SVG = styled('svg')`
  max-height: 100%;

  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
`;

const CurrentColorFill = styled(SVG)`
  fill: currentColor;
`;

const CurrentColorStroke = styled(SVG)`
  stroke: currentColor;
`;

export const BackIcon: FunctionComponent<JSX.SVGAttributes<SVGSVGElement>> = (
  props
) => (
  <CurrentColorFill {...props} viewBox="0 0 1000 1000">
    <path d="M794.6 120.8 683.9 10l-488 488 485.5 492 122.8-116.4-390.7-377.7 381.1-375.1z" />
  </CurrentColorFill>
);

export const MapIcon: FunctionComponent<JSX.SVGAttributes<SVGSVGElement>> = (
  props
) => (
  <CurrentColorFill {...props} viewBox="5 5 90 90">
    <path d="M75 30h-7v13H45v5h10v17h5V48h28v40H60v-8h-5v8H13V48h17v-5H13V13h55v7h7V5H5v90h90V40H75z"></path>
  </CurrentColorFill>
);

export const MenuIcon: FunctionComponent<JSX.SVGAttributes<SVGSVGElement>> = (
  props
) => (
  <CurrentColorFill {...props} viewBox="10 12 30 24">
    <path d="M10 12h30v4H10zM10 22h30v4H10zM10 32h30v4H10z"></path>
  </CurrentColorFill>
);

export const ReturnIcon: FunctionComponent<JSX.SVGAttributes<SVGSVGElement>> = (
  props
) => (
  <CurrentColorFill {...props} viewBox="1 4 50 44">
    <path d="M22 16V4L1 24l21 20V32s17-4 29 16c0 0 3-15-10-27 0 0-6-5-19-5z"></path>
  </CurrentColorFill>
);

const WaitIconOuter = styled(CurrentColorStroke)`
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
