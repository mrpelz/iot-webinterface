/* eslint-disable import/extensions */
import {
  BaseComponent,
  render,
  c
} from '../../dom.js';

export class App extends BaseComponent {
  create() {
    const app = [
      c('titlebar'),
      c('page-container'),
      c('menu')
    ];

    this.appendChild(
      render(...app)
    );
  }
}
