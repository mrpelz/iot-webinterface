export const deduplicate = <T extends WeakKey, S extends T[][]>(
  inputs: S,
): S => {
  const existing = new WeakSet();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return inputs.map((input) =>
    input.filter((item) => {
      if (existing.has(item)) return false;

      existing.add(item);
      return true;
    }),
  );
};
