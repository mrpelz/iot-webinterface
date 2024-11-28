export const isObject = (input: unknown): input is object => {
  if (typeof input !== 'object') return false;
  if (!input) return false;

  return true;
};
