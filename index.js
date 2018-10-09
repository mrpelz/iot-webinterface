/* eslint-disable import/extensions */
import { defineComponents, c, render } from './dom.js';
import { State } from './state.js';
import { setUpApi } from './network.js';
import { App } from './components/app/index.js';
import { TitleBar } from './components/titlebar/index.js';
import { PageContainer } from './components/page-container/index.js';
import { Page } from './components/page/index.js';
import { Category } from './components/category/index.js';
import { Menu } from './components/menu/index.js';
import { MenuElement } from './components/menu-element/index.js';

async function main() {
  window.componentState = new State();

  await Promise.all([
    setUpApi(),
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
      }
    ])
  ]);

  document.body.appendChild(
    render(c('app'))
  );

  document.documentElement.classList.add('ready');
}

if (
  window.customElements
  && document.body.attachShadow
  && typeof EventSource !== 'undefined'
) {
  document.addEventListener('DOMContentLoaded', main);
} else {
  /* eslint-disable-next-line no-alert */
  alert('your browser doesn\'t support custom elements, shadow dom and/or EventSource');
}
