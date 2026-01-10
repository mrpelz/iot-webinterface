export const capitalize = (input: string): string => {
  const [firstLetter, ...rest] = input.split('');
  if (!firstLetter) return '';

  return [firstLetter.toLocaleUpperCase(), ...rest].join('');
};

export const camelCaseToWords = (input: string): string[] => {
  const result: string[] = [];

  for (const char of input.split('')) {
    if (result.length === 0 || char.match(/[A-Z]/)) {
      result.push(char.toLocaleLowerCase());
      continue;
    }

    result[result.length - 1] = result.at(-1) + char.toLocaleLowerCase();
  }

  return result;
};
