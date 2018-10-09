/* eslint-disable import/extensions */
import {
  BaseComponent,
  c,
  render
} from '../../dom.js';

export class PageContainer extends BaseComponent {
  _handleRoomChange() {
    this.scrollTop = 0;
  }

  create() {
    const { rooms = [] } = window.componentState.get('_hierarchy');
    const elementNodes = rooms.map(({ categories }, id) => {
      return c(
        'page',
        {
          id,
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
