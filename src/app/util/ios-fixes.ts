export function iOSScrollToTop(): void {
  document.body.addEventListener(
    'click',
    ({ currentTarget }) => {
      if (currentTarget) return;

      scrollTo({
        behavior: 'smooth',
        top: 0,
      });
    },
    { passive: true }
  );
}

export function iOSHoverStyles(): void {
  document.body.addEventListener('touchstart', () => null, { passive: true });
}