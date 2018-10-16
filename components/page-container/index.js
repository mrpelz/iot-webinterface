/* eslint-disable import/extensions */
import {
  BaseComponent,
  bem,
  c,
  render
} from '../../dom.js';

const backgroundClass = bem('page-container', null, 'background');

export class PageContainer extends BaseComponent {
  _handleRoomChange(value) {
    const { rooms } = window.componentState.get('_hierarchy');
    const roomName = rooms[value].name;

    this.timeout = window.setTimeout(() => {
      window.clearTimeout(this.timeout);
      this.classList.remove(backgroundClass);
      this.timeout = window.setTimeout(() => {
        this.dataset.roomName = roomName;
        this.classList.add(backgroundClass);
      }, 1300);
    }, 200);
  }

  create() {
    const { rooms = [] } = window.componentState.get('_hierarchy');
    const elementNodes = rooms.map(({ name, categories }, id) => {
      return c(
        'page',
        {
          id,
          name,
          categories
        }
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
