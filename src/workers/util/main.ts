/* eslint-disable @typescript-eslint/no-unused-vars */

const defer = (callback: () => void): void => {
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
};

const fetchFallback = async (
  input: RequestInfo,
  timeout = 5000,
  init?: RequestInit
): Promise<readonly [Response | null, number | null, AbortController]> => {
  const abortController = new AbortController();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
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

    if (!response || !response.ok) {
      return [null, response?.status || null, abortController] as const;
    }

    return [response, response.status, abortController] as const;
  } catch {
    clear();

    return [null, null, abortController] as const;
  }
};

const waitForServiceWorker = (): Promise<void> => {
  const delay = 50;
  const url = '/E4B38FA2-08D2-4117-9738-29FC9106CBA0';

  return new Promise<void>((resolve, reject) => {
    try {
      let interval: number | null = null;

      const fn = async () => {
        const [response] = await fetchFallback(url, delay, {
          method: 'POST',
        });

        if (!response || (await response.text()) !== url) {
          return;
        }

        if (interval) clearInterval(interval);
        resolve();
      };

      interval = setInterval(fn, delay);
      fn();
    } catch {
      reject(new Error('could not check for SW presence'));
    }
  });
};

const indentMatcher = new RegExp('\\s*');

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
