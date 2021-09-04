export const add = (...inputs: string[]): string =>
  `calc(${inputs.join(' + ')})`;

export const subtract = (...inputs: string[]): string =>
  `calc(${inputs.join(' - ')})`;

export const dimension = (value: number): string => `${value}px`;
