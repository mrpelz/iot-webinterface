import { useEffect, useLayoutEffect, useRef } from 'preact/hooks';

export const useScrollRestore = (isOnRestoration: boolean): void => {
  const isOnRestorationRef = useRef(isOnRestoration);
  const scrollYRef = useRef<number>(0);

  useEffect(() => {
    const onScroll = () => {
      if (!isOnRestorationRef.current) return;
      scrollYRef.current = scrollY;
    };

    document.addEventListener('scroll', onScroll);

    return () => {
      document.removeEventListener('scroll', onScroll);
    };
  }, []);

  useLayoutEffect(() => {
    isOnRestorationRef.current = isOnRestoration;
    if (!isOnRestoration) return;

    scrollTo({
      behavior: 'instant' as ScrollBehavior,
      top: scrollYRef.current,
    });
  }, [isOnRestoration]);
};
