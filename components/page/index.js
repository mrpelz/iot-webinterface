/* eslint-disable import/extensions */
import {
  BaseComponent,
  bem,
  c,
  render
} from '../../dom.js';

const activeClass = bem('page', null, 'active');

export class Page extends BaseComponent {
  _handleRoomChange(value) {
    const { id } = this.props;

    if (id === value) {
      this.classList.add(activeClass);
    } else {
      this.classList.remove(activeClass);
    }
  }

  create() {
    const { categories = [] } = this.props;

    const elementNodes = categories.map((category) => {
      return c(
        'category',
        { category }
      );
    });

    this.appendChild(
      render(...elementNodes)
    );

    this.subscription = window.componentState.subscribe(
      '_selectedRoom',
      this._handleRoomChange.bind(this)
    );
  }

  destroy() {
    this.subscription.unsubscribe();
  }
}
