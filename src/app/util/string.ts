const indentMatcher = new RegExp('\\s*');

export const multiline = (
  strings: TemplateStringsArray | string,
  ...tags: string[]
): string => {
  const _strings = [...strings];
  const parts: string[] = [];

  while (_strings.length || tags.length) {
    parts.push(_strings.shift() || '');
    parts.push(tags.shift() || '');
  }

  const lines = parts.join('').trim().split('\n');

  let indent = 0;

  for (const line of lines) {
    const lineIndent = indentMatcher.exec(line)?.[0]?.length || 0;
    if (lineIndent && (!indent || lineIndent < indent)) indent = lineIndent;
  }

  const text = lines
    .map((line) => {
      const localIndent = indentMatcher.exec(line)?.[0]?.length || 0;
      const finalIndent = localIndent < indent ? 0 : localIndent - indent;

      return `${''.padStart(finalIndent, ' ')}${line.slice(localIndent)}`;
    })
    .join('\n');

  return `${text}\n`;
};
