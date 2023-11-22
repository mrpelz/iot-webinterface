export const defer = (callback: () => void): void => {
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

export const fetchFallback = async (
  input: RequestInfo | URL,
  timeout = 5000,
  init?: RequestInit,
): Promise<readonly [Response | undefined, number, AbortController]> => {
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
      return [undefined, response?.status ?? 0, abortController] as const;
    }

    return [response, response.status, abortController] as const;
  } catch {
    clear();

    return [undefined, 0, abortController] as const;
  }
};

export const sleep = (ms: number): Promise<void> =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
