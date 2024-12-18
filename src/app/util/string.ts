export const capitalize = (input: string): string => {
  const [firstLetter, ...rest] = input.split('');
  if (!firstLetter) return '';

  return [firstLetter.toLocaleUpperCase(), ...rest].join('');
};
