import './components/app/index.js';
import { jsx } from 'preact/jsx-runtime';
import { render } from 'preact';

export type Flags = {
  api: string;
  darkOverride: boolean | null;
  debug: boolean;
  invisibleOnBlur: boolean;
  lowPriorityStream: boolean;
  oledOptimizations: boolean;
  pageOverride: number | null;
  serviceWorker: boolean;
  stream: boolean;
};

export function readFlags(): Flags {
  const hashFlags = new URLSearchParams(location.hash.slice(1));

  const read = <T>(
    flag: string,
    fallback: T,
    typeCast: (input: string) => T
  ): T => {
    const storage = localStorage.getItem(`f_${flag}`) || hashFlags.get(flag);
    const value = storage === null ? fallback : typeCast(storage);

    // eslint-disable-next-line no-console
    console.table(`"${flag}": ${value}`);
    return value;
  };

  return {
    api: read('api', location.href, String),
    darkOverride: read('dao', null, (input) =>
      Boolean(Number.parseInt(input, 10))
    ),
    debug: read('dbg', false, (input) => Boolean(Number.parseInt(input, 10))),
    invisibleOnBlur: read('iob', false, (input) =>
      Boolean(Number.parseInt(input, 10))
    ),
    lowPriorityStream: read('lps', false, (input) =>
      Boolean(Number.parseInt(input, 10))
    ),
    oledOptimizations: read('olo', false, (input) =>
      Boolean(Number.parseInt(input, 10))
    ),
    pageOverride: read('pao', null, (input) => Number.parseInt(input, 10)),
    serviceWorker: read('swo', true, (input) =>
      Boolean(Number.parseInt(input, 10))
    ),
    stream: read('str', true, (input) => Boolean(Number.parseInt(input, 10))),
  };
}

function handleOledOptimizations() {
  document.documentElement.style.setProperty('--translucent-override', '1');
  document.documentElement.style.setProperty(
    '--menu-transition-duration-override',
    '0'
  );
}

async function deleteSW() {
  try {
    const keys = await caches.keys();
    const registrations = await navigator.serviceWorker.getRegistrations();

    await keys.forEach(async (key) => {
      await caches.delete(key);
    });

    await registrations.forEach(async (registration) => {
      await registration.unregister();
    });
  } catch {
    // noop
  }
}

async function handleSW() {
  try {
    await navigator.serviceWorker.register('/src/sw.js', {
      scope: '/',
    });
  } catch {
    // noop
  }
}

async function pre() {
  const flags = readFlags();

  if (flags.oledOptimizations) {
    handleOledOptimizations();
  }

  if (flags.serviceWorker) {
    await handleSW();
    return;
  }

  deleteSW();
}

async function main() {
  document.body.addEventListener('click', ({ currentTarget }) => {
    if (currentTarget) return;

    scrollTo({
      behavior: 'smooth',
      top: 0,
    });
  });

  // document.body.appendChild(render(c('app')));
  // state.set('_ready', true);

  // await setUpValues();
  // state.set('_values', true);

  render(jsx('div', {}, 'test'), document.body);
}

if (
  'serviceWorker' in navigator &&
  customElements &&
  document.body.attachShadow &&
  typeof EventSource !== 'undefined' &&
  typeof Intl !== 'undefined'
) {
  Promise.all([
    new Promise((resolve) => {
      document.addEventListener('DOMContentLoaded', () => {
        resolve(null);
      });
    }),
    pre(),
  ]).then(() => {
    main();
  });
} else {
  /* eslint-disable-next-line no-console */
  console.log(
    "your browser doesn't support custom elements, shadow dom, EventSource and/or Intl-API"
  );
}
