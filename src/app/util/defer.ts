export function defer(callback: () => void): void {
  if ('requestIdleCallback' in window) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    requestIdleCallback(callback);
    return;
  }

  if ('queueMicrotask' in window) {
    queueMicrotask(callback);
    return;
  }

  setTimeout(callback, 0);
}
