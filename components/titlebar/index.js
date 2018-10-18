/* eslint-disable import/extensions */
import {
  BaseComponent,
  h,
  render
} from '../../dom.js';

export class TitleBar extends BaseComponent {
  static handleDarkClick(e) {
    e.preventDefault();
    e.stopPropagation();

    window.componentState.set(
      '_darkMode',
      !window.componentState.get('_darkMode')
    );
  }

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
        h(
          'span',
          { id: 'dark' },
          '💡'
        ),
        h('h1', { id: 'room' }),
        h('section', { id: 'flags' }),
      ])
    );
  }

  render() {
    const { id } = this.props;
    if (id === undefined) return;

    const {
      locations: {
        [id]: location
      }
    } = window.componentHierarchy;
    const {
      locations: {
        [location.name]: displayName
      }
    } = window.componentStrings;

    this.get('#room').textContent = displayName;
    this.get('#dark').addEventListener('click', TitleBar.handleDarkClick);
  }

  destroy() {
    this.subscription.unsubscribe();
    this.get('#dark').removeEventListener('click', TitleBar.handleDarkClick);
  }
}
