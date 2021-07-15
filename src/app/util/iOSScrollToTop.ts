export function iOSScrollToTop(): void {
  document.body.addEventListener('click', ({ currentTarget }) => {
    if (currentTarget) return;

    scrollTo({
      behavior: 'smooth',
      top: 0,
    });
  });
}
