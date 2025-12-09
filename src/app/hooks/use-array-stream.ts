import { useEffect, useMemo, useState } from 'preact/hooks';

export const INTERVAL = 1000;

export const useLogStream = <T>(
  baseUrl: URL | string,
  validate: (input: unknown[]) => boolean,
  getNextUrl: (input: T[], url: URL) => URL | undefined,
  interval = INTERVAL,
): T[] => {
  const baseUrl_ = useMemo(() => new URL(baseUrl), [baseUrl]);

  const [elements, setElememts] = useState<T[]>([]);

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
            setElememts([]);

            return;
          }

          const nextUrl = getNextUrl(newElements, url);
          if (nextUrl) {
            url = nextUrl;
            setElememts((oldElements) => [oldElements, newElements].flat());
          }
        })
        .catch();
    };

    fn();
    const interval_ = setInterval(fn, interval);

    return () => {
      try {
        abort.abort();
      } catch {
        //
      }
      if (interval_) clearInterval(interval_);
    };
  }, [baseUrl_, getNextUrl, interval, validate]);

  return elements;
};
