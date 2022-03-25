export const dimension = (value: number): string => `${value}px`;

export const add = (...inputs: string[]): string =>
  `calc(${inputs.join(' + ')})`;

export const subtract = (...inputs: string[]): string =>
  `calc(${inputs.join(' - ')})`;

export const multiply = (...inputs: string[]): string =>
  `calc(${inputs.join(' * ')})`;

export const divide = (...inputs: string[]): string =>
  `calc(${inputs.join(' / ')})`;

export const invert = (input: string): string => multiply(input, '-1');
export const double = (input: string): string => multiply(input, '2');
export const half = (input: string): string => divide(input, '2');
