export const defer = (callback: () => void): void => {
  if ('queueMicrotask' in globalThis) {
    queueMicrotask(callback);
    return;
  }

  setTimeout(callback, 0);
};
