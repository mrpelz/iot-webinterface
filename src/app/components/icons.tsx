import { styled } from 'goober';
import { FunctionComponent } from 'preact';

import { dependentValue } from '../style/main.js';

const Svg = styled('svg')<{ color?: string; zIndex?: number }>`
  color: ${({ color }) => color || 'currentColor'};
  fill: none;
  stroke: none;
  z-index: ${({ zIndex }) => zIndex};
`;

const SvgStroke = styled(Svg)<{ thin?: boolean }>`
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke: currentColor !important;

  stroke-width: ${dependentValue('thin', '1', '2')};

  ${({ onClick }) => (onClick ? 'cursor: pointer' : '')};
`;

type SVGProps = Parameters<typeof Svg>['0'];
type SVGStrokeProps = Parameters<typeof SvgStroke>['0'];

export const ActivityIcon: FunctionComponent<SVGStrokeProps> = (props) => (
  // https://feathericons.com
  <SvgStroke viewBox="0 0 24 24" {...props}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </SvgStroke>
);

export const BackIcon: FunctionComponent<SVGStrokeProps> = (props) => (
  // https://feathericons.com
  <SvgStroke viewBox="0 0 24 24" {...props}>
    <polyline points="15 18 9 12 15 6" />
  </SvgStroke>
);

export const ForwardIcon: FunctionComponent<SVGStrokeProps> = (props) => (
  // https://feathericons.com
  <SvgStroke viewBox="0 0 24 24" {...props}>
    <polyline points="9 18 15 12 9 6" />
  </SvgStroke>
);

export const CheckIcon: FunctionComponent<SVGStrokeProps> = (props) => (
  // https://feathericons.com
  <SvgStroke viewBox="0 0 24 24" {...props}>
    <polyline points="20 6 9 17 4 12" />
  </SvgStroke>
);

export const CircleIcon: FunctionComponent<SVGProps> = (props) => (
  <Svg {...props} fill="" viewBox="0 0 24 24">
    <circle fill={props.fill} cx="12" cy="12" r="6" />
  </Svg>
);

export const ColorIcon: FunctionComponent<SVGProps> = (props) => (
  <Svg viewBox="0 0 24 24" {...props}>
    <defs xmlns="http://www.w3.org/2000/svg">
      <linearGradient id="rainbow">
        <stop offset="0" stop-color="red" />
        <stop offset="0.2857" stop-color="#ff0" />
        <stop offset="0.4286" stop-color="#0f0" />
        <stop offset="0.5714" stop-color="cyan" />
        <stop offset="0.7142" stop-color="blue" />
        <stop offset="0.8571" stop-color="#f0f" />
        <stop offset="1" stop-color="red" />
      </linearGradient>
    </defs>
    <circle fill="url(#rainbow)" cx="12" cy="12" r="9" />
  </Svg>
);

export const MapIcon: FunctionComponent<SVGStrokeProps> = (props) => (
  // https://feathericons.com
  <SvgStroke viewBox="0 0 24 24" {...props}>
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" />
    <line x1="16" y1="6" x2="16" y2="22" />
  </SvgStroke>
);

export const MenuIcon: FunctionComponent<SVGStrokeProps> = (props) => (
  // https://feathericons.com
  <SvgStroke viewBox="0 0 24 24" {...props}>
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </SvgStroke>
);

export const PauseIcon: FunctionComponent<SVGStrokeProps> = (props) => (
  // https://feathericons.com
  <SvgStroke viewBox="0 0 24 24" {...props}>
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </SvgStroke>
);

export const PlayIcon: FunctionComponent<SVGStrokeProps> = (props) => (
  // https://feathericons.com
  <SvgStroke viewBox="0 0 24 24" {...props}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </SvgStroke>
);

export const ReturnIcon: FunctionComponent<SVGStrokeProps> = (props) => (
  // https://feathericons.com
  <SvgStroke viewBox="0 0 24 24" {...props}>
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </SvgStroke>
);

export const TargetIcon: FunctionComponent<SVGStrokeProps> = (props) => (
  // https://feathericons.com
  <SvgStroke viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </SvgStroke>
);

export const WiFiIcon: FunctionComponent<SVGStrokeProps> = (props) => (
  // https://feathericons.com
  <SvgStroke viewBox="0 0 24 24" {...props}>
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" />
  </SvgStroke>
);

export const XIcon: FunctionComponent<SVGStrokeProps> = (props) => (
  // https://feathericons.com
  <SvgStroke viewBox="0 0 24 24" {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </SvgStroke>
);

const WaitIconOuter = styled(SvgStroke)`
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

export const WaitIcon: FunctionComponent<SVGStrokeProps> = (props) => (
  <WaitIconOuter viewBox="0 0 100 100" {...props}>
    <WaitIconInner cx="50" cy="50" r="45" />
  </WaitIconOuter>
);
