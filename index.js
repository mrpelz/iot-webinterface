/* eslint-disable import/extensions */
import { defineComponents, c, render } from './dom.js';
import { State } from './state.js';
import {
  getSavedPage,
  getDarkMode,
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
import { Switch, ClickableSwitch } from './components/switch/index.js';
import { TitleBar } from './components/titlebar/index.js';
import { UpDown } from './components/up-down/index.js';

async function main() {
  window.xState = new State();

  window.xState.set('_ready', false);
  window.xState.set('_values', false);

  window.xState.subscribe('_ready', (value) => {
    if (!value) return;
    document.documentElement.classList.add('ready');
  });
  window.xState.subscribe('_values', (value) => {
    if (!value) return;
    document.documentElement.classList.add('values');
  });
  window.xState.subscribe('_reload', () => {
    window.location.reload(false);
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
        component: Switch,
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
  window.xState.set('_ready', true);

  await setUpValues();
  window.xState.set('_values', true);
}

if (
  'serviceWorker' in navigator
  && window.customElements
  && document.body.attachShadow
  && typeof EventSource !== 'undefined'
  && typeof Intl !== 'undefined'
) {
  document.addEventListener('touchstart', () => {}, true);

  Promise.all([
    new Promise((resolve) => {
      document.addEventListener('DOMContentLoaded', () => {
        resolve();
      });
    }),
    navigator.serviceWorker.register(
      '/sw.js',
      { scope: '/' }
    ).catch(() => {})
  ]).then(() => {
    main();
  });
} else {
  /* eslint-disable-next-line no-alert */
  alert('your browser doesn\'t support custom elements, shadow dom, EventSource and/or Intl-API');
}
