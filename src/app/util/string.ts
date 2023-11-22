export const capitalize = (input: string): string => {
  const [firstLetter, ...rest] = input.split('');
  return [firstLetter.toLocaleUpperCase(), ...rest].join('');
};
