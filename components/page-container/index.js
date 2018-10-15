/* eslint-disable import/extensions */
import {
  BaseComponent,
  c,
  render
} from '../../dom.js';

export class PageContainer extends BaseComponent {
  _handleRoomChange(value) {
    const { rooms } = window.componentState.get('_hierarchy');
    const roomName = rooms[value].name;

    window.setTimeout(() => {
      this.dataset.roomName = roomName;
    }, 250);
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
