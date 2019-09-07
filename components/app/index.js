/* eslint-disable import/extensions */
import {
  BaseComponent,
  c,
  render
} from '../../dom.js';

const noScrollClass = 'no-scroll';

export class App extends BaseComponent {
  static handleRoomChange() {
    window.scrollTo(0, 0);
  }

  static handleMenu() {
    const open = window.xState.get('_menu');
    document.documentElement.classList.toggle(noScrollClass, open);
  }

  create() {
    this.id = 'root';

    const app = [
      c('titlebar'),
      c('menu'),
      c('page-container')
    ];

    this.appendChild(
      render(...app)
    );

    this.subscriptions = [
      window.xState.subscribe(
        '_selectedRoom',
        App.handleRoomChange
      ),
      window.xState.subscribe(
        '_menu',
        App.handleMenu
      )
    ];
  }

  destroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
