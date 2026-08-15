import { shortenedPath } from '../state/navigation.js';
import { useArray } from './use-array-compare.js';

export const useShortenedPath = <T>(
  path?: (string | number)[],
): (string | number)[] | undefined => {
  const path_ = useArray(path);
  if (!path_) return undefined;

  return shortenedPath(path_).value;
};
