import {
  MutableRef,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';

export const useMap = <K, V>(): [symbol, MutableRef<Map<K, V>>, Map<K, V>] => {
  const map = useRef(new Map<K, V>());
  const [symbol, setSymbol] = useState(Symbol('useMap'));

  const update = useCallback(() => setSymbol(Symbol('useMap')), []);

  const actions = useMemo<Map<K, V>>(
    () => ({
      clear: () => {
        map.current.clear();
        update();
      },
      delete: (key) => {
        if (!map.current.has(key)) return false;

        const result = map.current.delete(key);
        update();

        return result;
      },
      entries: map.current.entries,
      forEach: map.current.forEach,
      get: map.current.get,
      has: map.current.has,
      keys: map.current.keys,
      set: (key, value) => {
        if (map.current.get(key) === value) return map.current;

        const result = map.current.set(key, value);
        update();

        return result;
      },
      size: map.current.size,
      values: map.current.values,
      [Symbol.iterator]: map.current[Symbol.iterator],
      [Symbol.toStringTag]: map.current[Symbol.toStringTag],
    }),
    [update],
  );

  return [symbol, map, actions];
};
