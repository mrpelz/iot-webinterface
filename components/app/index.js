/* eslint-disable import/extensions */
import {
  BaseComponent,
  getComponent
} from '../../dom.js';

export class App extends BaseComponent {
  async render() {
    const [Menu, TitleBar, Page] = await Promise.all([
      getComponent('menu'),
      getComponent('titlebar'),
      getComponent('page')
    ]);

    this.shadowRoot.appendChild(new Menu());
    this.shadowRoot.appendChild(new TitleBar({
      room: 'Wohnzimmer'
    }));
    this.shadowRoot.appendChild(new Page());
  }
}
