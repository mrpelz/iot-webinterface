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
  await defineComponent('efghi', Efghi);

  document.documentElement.classList.add('ready');
  document.documentElement.dispatchEvent(ready);
  console.log('ready');
}

document.addEventListener('DOMContentLoaded', main);
