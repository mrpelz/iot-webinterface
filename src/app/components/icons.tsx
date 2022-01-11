import { FunctionComponent } from 'preact';
import { styled } from 'goober';

const SVG = styled('svg')`
  max-height: 100%;

  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
`;

const Back = styled(SVG)`
  fill: currentColor;
`;

export const BackIcon: FunctionComponent<JSX.SVGAttributes<SVGSVGElement>> = (
  props
) => (
  <Back {...props} viewBox="1 4 50 44">
    <path d="M22 16V4L1 24l21 20V32s17-4 29 16c0 0 3-15-10-27 0 0-6-5-19-5z"></path>
  </Back>
);

const Map = styled(SVG)`
  fill: currentColor;
`;

export const MapIcon: FunctionComponent<JSX.SVGAttributes<SVGSVGElement>> = (
  props
) => (
  <Map {...props} viewBox="5 5 90 90">
    <path d="M75 30h-7v13H45v5h10v17h5V48h28v40H60v-8h-5v8H13V48h17v-5H13V13h55v7h7V5H5v90h90V40H75z"></path>
  </Map>
);

const Menu = styled(SVG)`
  fill: currentColor;
`;

export const MenuIcon: FunctionComponent<JSX.SVGAttributes<SVGSVGElement>> = (
  props
) => (
  <Menu {...props} viewBox="10 12 30 24">
    <path d="M10 12h30v4H10zM10 22h30v4H10zM10 32h30v4H10z"></path>
  </Menu>
);

const Wait = styled(SVG)`
  animation: 2s linear infinite wait-outer-animation;
  stroke: currentColor;

  @keyframes wait-outer-animation {
    0% {
      transform: rotateZ(0deg);
    }
    100% {
      transform: rotateZ(360deg);
    }
  }
`;

const Circle = styled('circle')`
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
  <Wait {...props} viewBox="0 0 100 100">
    <Circle cx="50" cy="50" r="45" />
  </Wait>
);
