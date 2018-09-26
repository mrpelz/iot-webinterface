/* eslint-disable import/extensions */
import {
  BaseComponent,
  getComponent
} from '../../dom.js';

export class App extends BaseComponent {
  constructor(template) {
    super(template);

    this.count = 0;

    window.setInterval(() => {
      const component = getComponent('page');
      component.dataset.count = this.count;
      component.render();

      this.shadowRoot.firstChild.nextSibling.replace(component);
      this.count += 1;
    }, 5000);
  }
}
