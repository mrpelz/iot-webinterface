import { useEffect, useState } from 'preact/hooks';

const mountDefine = <T>(callback: (result: T) => void) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  globalThis.define = (() => {
    // eslint-disable-next-line func-style
    const define = function define(_: unknown, factory: T) {
      callback(factory);
    };

    define.amd = true;

    return define;
  })();
};

const unmountDefine = () => {
  if (!('define' in globalThis)) return;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  globalThis.define = undefined;
};

export const useUMDModule = <T>(src: string): T | null => {
  const [module, setModule] = useState<T | null>(null);

  useEffect(() => {
    mountDefine<T>((result) => setModule(result));

    const script = document.createElement('script');
    script.crossOrigin = 'use-credentials';
    script.src = src;
    script.async = true;

    document.head.append(script);

    return () => {
      script.remove();
      URL.revokeObjectURL(src);
      unmountDefine();
    };
  }, [src]);

  return module;
};
