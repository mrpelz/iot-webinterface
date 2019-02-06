/* eslint-disable import/extensions */
import {
  BaseComponent,
  h,
  render
} from '../../dom.js';

export class TitleBar extends BaseComponent {
  static handleDarkClick(e) {
    TitleBar.eventPreventAndStop(e);

    window.xState.set(
      '_darkMode',
      !window.xState.get('_darkMode')
    );
  }

  static handleReloadClick(e) {
    TitleBar.eventPreventAndStop(e);

    window.xState.set('_reload');
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
        h(
          'span',
          { id: 'dark' },
          '💡'
        ),
        h('h1', { id: 'room' }),
        h('section', { id: 'flags' }),
        h(
          'span',
          { id: 'reload' },
          '🔄'
        ),
        h(
          'span',
          { id: 'wait' },
          '■'
        )
      ])
    );

    this.get('#dark').addEventListener('click', TitleBar.handleDarkClick);
    this.get('#reload').addEventListener('click', TitleBar.handleReloadClick);
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
    this.get('#reload').classList.toggle('active', !stream);
    this.get('#wait').classList.toggle('active', !stream);
  }

  destroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.get('#dark').removeEventListener('click', TitleBar.handleDarkClick);
  }
}
