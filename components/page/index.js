/* eslint-disable import/extensions */
import {
  BaseComponent,
  bem,
  c,
  render
} from '../../dom.js';

import {
  setElement
} from '../../network.js';

const activeClass = bem('page', null, 'active');

export class Page extends BaseComponent {
  _handleRoomChange(value) {
    const { id } = this.props;

    if (id === value) {
      if (id === 9) {
        setElement({ name: 'testLicht', value: true });
      } else if (id === 10) {
        setElement({ name: 'testLicht', value: false });
      }

      this.classList.add(activeClass);
    } else {
      this.classList.remove(activeClass);
    }
  }

  create() {
    const { name: roomName, categories = [] } = this.props;

    const elementNodes = categories.map(({ name, controls }, id) => {
      return c(
        'category',
        {
          id,
          name,
          controls
        }
      );
    });

    this.dataset.roomName = roomName;

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
