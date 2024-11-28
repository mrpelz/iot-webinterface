export const sortBy = <T extends object, K extends keyof Required<T>>(
  input: readonly T[],
  property: K,
  list: readonly T[K][],
): Record<'all' | 'listedResults' | 'unlistedResults', T[]> => {
  const listedResultsCollection: T[][] = [];

  for (const listItem of list) {
    const match = input.filter(
      (element) => property in element && element[property] === listItem,
    );
    if (match.length === 0) continue;

    listedResultsCollection.push(match);
  }

  const listedResults = listedResultsCollection.flat(1);

  const unlistedResults: T[] = [];

  for (const element of input) {
    if (!(property in element)) continue;

    const value = element[property];
    if (!value) continue;
    if (list.includes(value)) continue;

    unlistedResults.push(element);
  }

  return {
    get all() {
      return [listedResults, unlistedResults].flat(1);
    },
    listedResults,
    unlistedResults,
  };
};
