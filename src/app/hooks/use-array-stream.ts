import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';

export const INTERVAL = 1000;

export const useArrayStream = <T>(
  baseUrl: URL | string,
  validate: (input: unknown[]) => boolean,
  getNextUrl: (input: T[], url: URL) => URL | undefined,
  interval = INTERVAL,
): { elements: T[]; insert: (...elements_: T[]) => void } => {
  const baseUrl_ = useMemo(() => new URL(baseUrl), [baseUrl]);

  const [elements, setElements] = useState<T[]>([]);

  useEffect(() => {
    const abort = new AbortController();

    let url = baseUrl_;

    const fn = () => {
      fetch(url, { signal: abort.signal })
        .then((response) =>
          response.ok ? (response.json() as Promise<T[]>) : undefined,
        )
        .then((newElements) => {
          if (
            newElements === undefined ||
            !Array.isArray(newElements) ||
            !validate(newElements)
          ) {
            url = baseUrl_;
            setElements([]);

            return;
          }

          const nextUrl = getNextUrl(newElements, url);
          if (nextUrl) {
            url = nextUrl;
            setElements((oldElements) => [oldElements, newElements].flat());
          }
        })
        .catch();
    };

    fn();
    const interval_ = setInterval(fn, interval);

    return () => {
      abort.abort();

      if (interval_) clearInterval(interval_);
    };
  }, [baseUrl_, getNextUrl, interval, validate]);

  const insert = useCallback(
    (...elements_: T[]) =>
      setElements((oldElements) => [oldElements, elements_].flat()),
    [],
  );

  return { elements, insert };
};
