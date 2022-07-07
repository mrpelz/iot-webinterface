import { useEffect, useLayoutEffect, useRef } from 'preact/hooks';

export const useScrollRestore = (isOnRestoration: boolean): void => {
  const isOnRestorationRef = useRef(isOnRestoration);
  const scrollYRef = useRef<number>(0);

  useEffect(() => {
    const onScroll = () => {
      if (!isOnRestorationRef.current) return;
      scrollYRef.current = scrollY;
    };

    document.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      document.removeEventListener('scroll', onScroll);
    };
  }, []);

  useLayoutEffect(() => {
    isOnRestorationRef.current = isOnRestoration;

    scrollTo({
      behavior: 'instant' as ScrollBehavior,
      top: isOnRestoration ? scrollYRef.current : 0,
    });
  }, [isOnRestoration]);
};
