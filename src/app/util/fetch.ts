export const fetchFallback = async (
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
