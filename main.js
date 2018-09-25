/* eslint-disable import/extensions */
import {
  defineComponent
} from './dom.js';

import {
  Abcde
} from './components/abcde/component.js';

import {
  Efghi
} from './components/efghi/component.js';

async function main() {
  const ready = new Event('webComponentsLoaded');

  await defineComponent('abcde', Abcde, true);
  await defineComponent('efghi', Efghi, true);

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
