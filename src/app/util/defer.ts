export const defer = (callback: () => void): void => {
  if ('queueMicrotask' in window) {
    queueMicrotask(callback);
    return;
  }

  setTimeout(callback, 0);
};
