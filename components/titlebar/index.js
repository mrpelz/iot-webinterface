/* eslint-disable import/extensions */
import {
  BaseComponent,
  h,
  render
} from '../../dom.js';

const menuButtonSVG = `
  <svg height="32" version="1" width="32" xmlns="http://www.w3.org/2000/svg">
    <path fill="currentColor" d="M4 10h24a2 2 0 0 0 0-4H4a2 2 0 0 0 0 4zm24 4H4a2 2 0 0 0 0 4h24a2 2 0 0 0 0-4zm0 8H4a2 2 0 0 0 0 4h24a2 2 0 0 0 0-4z"/>
  </svg>
`;

export class TitleBar extends BaseComponent {
  static handleMenuButtonClick(e) {
    BaseComponent.eventPreventAndStop(e);

    window.xState.set(
      '_menu',
      !window.xState.get('_menu')
    );
  }

  _handleTitleChange(id) {
    this.setProps({
      id
    });
  }

  _handleStream(stream) {
    this.setProps({
      stream
    });
  }

  create() {
    this.subscriptions = [
      window.xState.subscribe(
        '_selectedRoom',
        this._handleTitleChange.bind(this)
      ),
      window.xState.subscribe(
        '_stream',
        this._handleStream.bind(this)
      )
    ];

    this.shadowRoot.appendChild(
      render(...[
        h('h1', { id: 'room' }),
        h('section', { id: 'flags' }),
        h('div', { id: 'menubutton' }),
        h('div', { id: 'wait' })
      ])
    );

    this.get('#menubutton').innerHTML = menuButtonSVG;
    this.get('#menubutton').addEventListener('click', TitleBar.handleMenuButtonClick);
  }

  render() {
    const { id, stream = false } = this.props;
    if (id === undefined) return;

    const { sections = [] } = window.xHierarchy;
    const {
      [id]: {
        section = null
      } = {}
    } = [].concat(...sections);

    const displayName = window.xExpand(section) || '';

    this.get('#room').textContent = displayName;
    this.get('#wait').classList.toggle('active', stream);
  }

  destroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });

    this.get('#menubutton').removeEventListener('click', TitleBar.handleMenuButtonClick);
  }
}
