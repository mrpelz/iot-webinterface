/* eslint-disable import/extensions */
import {
  BaseComponent,
  render,
  c
} from '../../dom.js';

export class App extends BaseComponent {
  static handleRoomChange() {
    window.scrollTo(0, 0);
  }

  create() {
    const app = [
      c('titlebar'),
      c('page-container'),
      c('menu')
    ];

    this.appendChild(
      render(...app)
    );

    this.subscription = window.xState.subscribe(
      '_selectedRoom',
      App.handleRoomChange
    );
  }

  destroy() {
    this.subscription.unsubscribe();
  }
}
