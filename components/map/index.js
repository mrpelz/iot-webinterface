/* eslint-disable import/extensions */
import {
  BaseComponent,
  bem,
  h,
  render
} from '../../dom.js';

const activeClass = bem('extension', null, 'active');

export class MapComponent extends BaseComponent {
  _handleSectionChange(value) {
    const { id } = this.props;

    if (id === value) {
      this.classList.add(activeClass);
    } else {
      this.classList.remove(activeClass);
    }
  }

  create() {
    window.xState.subscribe('*', (value, key) => {
      this.prepend(
        render(
          h(
            'div',
            {},
            JSON.stringify({ [key]: value })
          )
        )
      );
    });

    this.subscription = window.xState.subscribe(
      '_selectedRoom',
      this._handleSectionChange.bind(this)
    );
  }

  destroy() {
    this.subscription.unsubscribe();
  }
}
