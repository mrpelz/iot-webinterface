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
import { TitleBar } from './components/titlebar/index.js';
import { PageContainer } from './components/page-container/index.js';
import { Page } from './components/page/index.js';
import { Category } from './components/category/index.js';
import { Control } from './components/control/index.js';
import { SimpleSwitch } from './components/simple-switch/index.js';
import { Metric } from './components/metric/index.js';
import { BinaryLight } from './components/binary-light/index.js';
import { Menu } from './components/menu/index.js';
import { MenuElement } from './components/menu-element/index.js';

async function main() {
  window.componentState = new State();

  window.componentState.set('_isReady', false);
  window.componentState.set('_hasValues', false);

  window.componentState.subscribe('_isReady', (value) => {
    if (!value) return;
    document.documentElement.classList.add('ready');
  });
  window.componentState.subscribe('_hasValues', (value) => {
    if (!value) return;
    document.documentElement.classList.add('values');
  });

  getSavedPage();
  getDarkMode();

  await Promise.all([
    setUpElements(),
    defineComponents([
      {
        slug: 'app',
        component: App,
        style: true
      },
      {
        slug: 'menu',
        component: Menu,
        style: true
      },
      {
        slug: 'menu-element',
        component: MenuElement,
        style: true
      },
      {
        slug: 'titlebar',
        component: TitleBar,
        style: true
      },
      {
        slug: 'page-container',
        component: PageContainer,
        style: true
      },
      {
        slug: 'page',
        component: Page,
        style: true
      },
      {
        slug: 'category',
        component: Category,
        style: true
      },
      {
        slug: 'control',
        component: Control
      },
      {
        slug: 'simple-switch',
        component: SimpleSwitch,
        style: true
      },
      {
        slug: 'metric',
        component: Metric,
        style: true
      },
      {
        slug: 'binary-light',
        component: BinaryLight,
        style: true
      }
    ])
  ]);

  document.body.appendChild(
    render(c('app'))
  );
  window.componentState.set('_isReady', true);

  await setUpValues();
  window.componentState.set('_hasValues', true);
}

if (
  window.customElements
  && document.body.attachShadow
  && typeof EventSource !== 'undefined'
  && typeof Intl !== 'undefined'
) {
  document.addEventListener('DOMContentLoaded', main);
  document.addEventListener('touchstart', () => {}, true);
} else {
  /* eslint-disable-next-line no-alert */
  alert('your browser doesn\'t support custom elements, shadow dom, EventSource and/or Intl-API');
}
