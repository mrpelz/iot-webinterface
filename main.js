/* eslint-disable import/extensions */
import {
  defineComponent
} from './dom.js';

import {
  App
} from './components/app/component.js';

import {
  Page
} from './components/page/component.js';

import {
  Menu
} from './components/menu/component.js';

async function main() {
  const ready = new Event('webComponentsLoaded');

  await defineComponent('app', App, true);
  await defineComponent('page', Page, true);
  await defineComponent('menu', Menu, true);

  document.documentElement.classList.add('ready');
  document.documentElement.dispatchEvent(ready);
  console.log('ready');
}

if (window.customElements && document.body.attachShadow) {
  document.addEventListener('DOMContentLoaded', main);
} else {
  console.log('not supported');
  document.documentElement.classList.add('unsupported');
}
