export const capitalize = (input: string): string => {
  const [firstLetter, ...rest] = input.split('');
  if (!firstLetter) return '';

  return [firstLetter.toLocaleUpperCase(), ...rest].join('');
};

export const camelCaseToWords = (input: string): string[] => {
  const result: string[] = [];

  for (const char of input.split('')) {
    const last = result.at(-1);
    const isUppercase = Boolean(char.match(/[A-Z]/));

    const endCharIsUppercase = Boolean((last?.at(-1) ?? '').match(/[A-Z]/));

    if (result.length === 0 || (isUppercase && !endCharIsUppercase)) {
      result.push(char);
      continue;
    }

    result[result.length - 1] = [last, char].join('');
  }

  return result.map((word) => word.toLocaleLowerCase());
};
