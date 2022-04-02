import { useEffect, useState } from 'preact/hooks';
import { fetchFallback } from './fetch.js';

export const useFetch = (url: string, method = 'GET'): Response | null => {
  const [state, setState] = useState<Response | null>(null);

  useEffect(() => {
    let abortController: AbortController;

    (async () => {
      const [response, , abort] = await fetchFallback(url, undefined, {
        method,
      });
      abortController = abort;

      if (!response) return;

      setState(response);
    })();

    return () => abortController?.abort();
  }, [method, url]);

  return state;
};

export const useFetchJson = <T>(url: string, method?: string): T | null => {
  const response = useFetch(url, method);

  const [state, setState] = useState<T | null>(null);

  useEffect(() => {
    (async () => {
      if (!response) return;
      const value = (await response.json()) as T;

      setState(value);
    })();
  }, [response]);

  return state;
};

export const useFetchText = (url: string, method = 'GET'): string | null => {
  const response = useFetch(url, method);

  const [state, setState] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!response) return;
      const value = await response.text();

      setState(value);
    })();
  }, [response]);

  return state;
};
