import { ClickableSwitch, Switch } from './components/switch/index.js';
import { c, defineComponents, render } from './dom.js';
import {
  getDarkMode,
  getSavedPage,
  setUpElements,
  setUpValues
} from './network.js';
import { App } from './components/app/index.js';
import { Category } from './components/category/index.js';
import { MapComponent } from './components/map/index.js';
import { Menu } from './components/menu/index.js';
import { MenuElement } from './components/menu-element/index.js';
import { Metric } from './components/metric/index.js';
import { Page } from './components/page/index.js';
import { PageContainer } from './components/page-container/index.js';
import { State } from './state.js';
import { TitleBar } from './components/titlebar/index.js';
import { UpDown } from './components/up-down/index.js';

export const state = new State();

/**
 * @type {undefined | {
 *  debug: boolean,
 *  serviceWorker: boolean,
 *  stream: boolean,
 *  api: string
 * }}
 */
export let flags;

function readFlags() {

  /**
   * @template T
   * @param {string} flag
   * @param {T} fallback
   * @param {(...any) => T} typeCast
   * @returns {T}
   */
  const read = (flag, fallback, typeCast) => {
    const storage = localStorage.getItem(flag);
    const value = typeCast(storage === null ? fallback : storage);

    // eslint-disable-next-line no-console
    console.table(`"${flag}": ${value}`);
    return value;
  };

  flags = {
    debug: read('debug', false, Boolean),
    serviceWorker: read('sw', true, Boolean),
    stream: read('stream', true, Boolean),
    api: read('api', location.href, String)
  };
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
  } catch (_) {
    // empty
  }
}

async function handleSW() {
  const { serviceWorker } = flags;

  if (serviceWorker) {
    try {
      await navigator.serviceWorker.register(
        './sw.js', {
        scope: '/'
      }
      );
    } catch (_) {
      // empty
    }

    return;
  }

  deleteSW();
}

async function pre() {
  readFlags();
  await handleSW();
}

async function main() {
  state.set('_menu', false);
  state.set('_ready', false);
  state.set('_values', false);

  state.subscribe('_ready', (value) => {
    if (!value) return;
    document.documentElement.classList.add('ready');
  });
  state.subscribe('_values', (value) => {
    if (!value) return;
    document.documentElement.classList.add('values');
  });
  state.subscribe('_reload', () => {
    deleteSW().then(() => {
      location.reload(false);
    });
  }, false);

  getSavedPage();
  getDarkMode();

  await Promise.all([
    setUpElements(),
    defineComponents([
      {
        slug: 'app',
        component: App,
        styles: ['app']
      },
      {
        slug: 'binary-light',
        component: ClickableSwitch,
        styles: ['switch', 'binary-light']
      },
      {
        slug: 'category',
        component: Category,
        styles: ['category']
      },
      {
        slug: 'connection',
        component: ClickableSwitch,
        styles: ['switch', 'connection']
      },
      {
        slug: 'door',
        component: Switch,
        styles: ['switch', 'door']
      },
      {
        slug: 'fan',
        component: ClickableSwitch,
        styles: ['switch', 'fan']
      },
      {
        slug: 'map',
        component: MapComponent,
        styles: ['map'],
        template: true
      },
      {
        slug: 'menu',
        component: Menu,
        styles: ['menu']
      },
      {
        slug: 'menu-element',
        component: MenuElement,
        styles: ['menu-element']
      },
      {
        slug: 'metric',
        component: Metric,
        styles: ['switch', 'metric']
      },
      {
        slug: 'pir',
        component: Switch,
        styles: ['switch', 'pir']
      },
      {
        slug: 'page',
        component: Page,
        styles: ['page']
      },
      {
        slug: 'page-container',
        component: PageContainer,
        styles: ['page-container']
      },
      {
        slug: 'security',
        component: ClickableSwitch,
        styles: ['switch', 'security']
      },
      {
        slug: 'switch',
        component: Switch,
        styles: ['switch']
      },
      {
        slug: 'titlebar',
        component: TitleBar,
        styles: ['titlebar']
      },
      {
        slug: 'up-down',
        component: UpDown,
        styles: ['up-down']
      }
    ])
  ]);

  document.body.appendChild(
    render(c('app'))
  );
  state.set('_ready', true);

  await setUpValues();
  state.set('_values', true);
}

if (
  'serviceWorker' in navigator
  && customElements
  && document.body.attachShadow
  && typeof EventSource !== 'undefined'
  && typeof Intl !== 'undefined'
) {
  Promise.all([
    new Promise((resolve) => {
      document.addEventListener('DOMContentLoaded', () => {
        resolve();
      });
    }),
    pre()
  ]).then(() => {
    main();
  });
} else {
  /* eslint-disable-next-line no-alert */
  alert('your browser doesn\'t support custom elements, shadow dom, EventSource and/or Intl-API');
}
