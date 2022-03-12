export const amendUrlPath = (path: string): URL => {
  const url = new URL(location.href);
  url.pathname = path;

  return url;
};
