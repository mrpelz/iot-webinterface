/* eslint-disable import/extensions */
import {
  BaseComponent,
  c,
  render
} from '../../dom.js';

const scrollOffset = 10;

export class Menu extends BaseComponent {
  // _animateScroll(target) {

  // }

  _handleChange(index) {
    window.setTimeout(() => {
      const { offsetLeft, scrollWidth } = this.childNodes[index];

      const scrollLeft = Math.max(0, offsetLeft
        + scrollOffset
        + (scrollWidth / 2)
        - (this.offsetWidth / 2));

      this.scrollLeft = scrollLeft;
    }, 0);
  }

  create() {
    const { rooms = [] } = window.componentState.get('_hierarchy');
    const itemNodes = rooms.map((_, id) => {
      return c(
        'menu-element',
        { id }
      );
    });

    this.appendChild(
      render(...itemNodes)
    );

    this.subscription = window.componentState.subscribe(
      '_selectedRoom',
      this._handleChange.bind(this)
    );

    this._handleChange(
      window.componentState.get('_selectedRoom')
    );
  }

  destroy() {
    this.subscription.unsubscribe();
  }
}
