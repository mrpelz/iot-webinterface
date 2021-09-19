import { FunctionComponent } from 'preact';
import { styled } from 'goober';

const _Back = styled('svg')`
  fill: currentColor;
  max-height: 100%;
`;

export const Back: FunctionComponent = () => (
  <_Back viewBox="1 4 50 44">
    <path d="M22 16V4L1 24l21 20V32s17-4 29 16c0 0 3-15-10-27 0 0-6-5-19-5z"></path>
  </_Back>
);

const _Map = styled('svg')`
  fill: currentColor;
  max-height: 100%;
`;

export const Map: FunctionComponent = () => (
  <_Map viewBox="5 5 90 90">
    <path d="M75 30h-7v13H45v5h10v17h5V48h28v40H60v-8h-5v8H13V48h17v-5H13V13h55v7h7V5H5v90h90V40H75z"></path>
  </_Map>
);

const _Menu = styled('svg')`
  fill: currentColor;
  max-height: 100%;
`;

export const Menu: FunctionComponent = () => (
  <_Menu viewBox="10 12 30 24">
    <path d="M10 12h30v4H10zM10 22h30v4H10zM10 32h30v4H10z"></path>
  </_Menu>
);

const _Wait = styled('svg')`
  animation: 2s linear infinite wait-outer-animation;
  max-height: 100%;
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

const _Circle = styled('circle')`
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

export const Wait: FunctionComponent = () => (
  <_Wait viewBox="0 0 100 100">
    <_Circle cx="50" cy="50" r="45" />
  </_Wait>
);
