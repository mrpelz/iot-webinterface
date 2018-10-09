/* eslint-disable import/extensions */
import {
  BaseComponent,
  h,
  render
} from '../../dom.js';

export class TitleBar extends BaseComponent {
  _handleTitleChange(id) {
    this.setProps({
      id
    });
  }

  create() {
    this.subscription = window.componentState.subscribe(
      '_selectedRoom',
      this._handleTitleChange.bind(this)
    );

    this.shadowRoot.appendChild(
      render(...[
        h('h1', { id: 'room' }),
        h('section', { id: 'flags' }),
      ])
    );
  }

  render() {
    const { id } = this.props;
    if (id === undefined) return;

    const { rooms } = window.componentState.get('_hierarchy');
    this.shadowRoot.getElementById('room').textContent = rooms[id].name;
  }

  destroy() {
    this.subscription.unsubscribe();
  }
}
