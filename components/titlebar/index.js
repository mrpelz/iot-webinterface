/* eslint-disable import/extensions */
import {
  BaseComponent,
  h,
  render
} from '../../dom.js';

const menuButtonSVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M10 12h30v4H10z"/><path d="M10 22h30v4H10z"/><path d="M10 32h30v4H10z"/></svg>
`;

const spinnerSVG = `
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45"></circle>
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

    this.get('#wait').innerHTML = spinnerSVG;
    this.get('#menubutton').innerHTML = menuButtonSVG;

    this.get('#menubutton').addEventListener('mousedown', TitleBar.handleMenuButtonClick);
    this.get('#menubutton').addEventListener('touchstart', TitleBar.handleMenuButtonClick);
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
