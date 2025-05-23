const relevantPathMatcher = new RegExp('/*(?<path>.*)/*');

export const amend = (path: string): URL => {
  const result = new URL(location.href);
  result.pathname = path;

  return result;
};

export const getSegments = (path: string): string[] => {
  const relevantPath = relevantPathMatcher.exec(path)?.groups?.path;
  if (!relevantPath?.length) return [];
  return relevantPath.split('/').map((segment) => decodeURIComponent(segment));
};

export const getPath = (segments: string[]): string =>
  `/${segments.map((segment) => encodeURIComponent(segment)).join('/')}`;

export const goDown = (basePath: string, path: string): string =>
  getPath([getSegments(basePath), getSegments(path)].flat());

export const goUp = (basePath: string): string =>
  getPath(getSegments(basePath).slice(0, -1));

export const getCommonSegments = (
  segmentsA: string[],
  segmentsB: string[],
): string[] => {
  const commonSegments: string[] = [];

  // eslint-disable-next-line unicorn/no-for-loop
  for (let index = 0; index < segmentsA.length; index += 1) {
    const segmentA = segmentsA[index];
    const segmentB = segmentsB[index];

    if (segmentA !== segmentB) break;

    if (segmentA) commonSegments.push(segmentA);
  }

  return commonSegments;
};

export const getCommonPath = (pathA: string, pathB: string): string =>
  getPath(getCommonSegments(getSegments(pathA), getSegments(pathB)));
