// eslint-disable-next-line @typescript-eslint/no-unused-vars
function defer(callback: () => void): void {
  if ('requestIdleCallback' in self) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    requestIdleCallback(callback);
    return;
  }

  if ('queueMicrotask' in self) {
    queueMicrotask(callback);
    return;
  }

  setTimeout(callback, 0);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchFallback = async (
  input: RequestInfo,
  timeout = 5000,
  init?: RequestInit
): Promise<Response | null> => {
  const abortController = new AbortController();

  const aTimeout = setTimeout(() => abortController.abort(), timeout);
  const clear = () => clearTimeout(aTimeout);

  try {
    const response = await fetch(input, {
      ...init,
      credentials: 'include',
      redirect: 'follow',
      signal: abortController.signal,
    }).catch(() => undefined);

    clear();

    if (!response || !response.ok) return null;
    return response;
  } catch {
    clear();

    return null;
  }
};

const indentMatcher = new RegExp('\\s*');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const multiline = (
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
