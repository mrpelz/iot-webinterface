export const fetchFallback = async (
  input: RequestInfo,
  timeout = 5000,
  init?: RequestInit,
): Promise<readonly [Response | null, number | null, AbortController]> => {
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

    if (!response || !response.ok) {
      return [null, response?.status || null, abortController] as const;
    }

    return [response, response.status, abortController] as const;
  } catch {
    clear();

    return [null, null, abortController] as const;
  }
};
