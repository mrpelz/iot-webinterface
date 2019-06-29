/* eslint-disable import/extensions */
import {
  BaseComponent,
  h,
  render
} from '../../dom.js';

const mapId = 2;

const menuButtonSVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
    <path d="M10 12h30v4H10zM10 22h30v4H10zM10 32h30v4H10z"/>
  </svg>
`.trim();

const spinnerSVG = `
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45"></circle>
  </svg>
`.trim();

const mapButtonSVG = `
  <svg viewBox="0 -10 120 120" xmlns="http://www.w3.org/2000/svg">
    <path d="M75 30h-7v13H45v5h10v17h5V48h28v40H60v-8h-5v8H13V48h17v-5H13V13h55v7h7V5H5v90h90V40H75z"/>
  </svg>
`.trim();

const backButtonSVG = `
  <svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 -5 70 70">
    <path d="M22 16V4L1 24l21 20V32s17-4 29 16c0 0 3-15-10-27 0 0-6-5-19-5z"/>
    <path d="M52 51l-2-2C40 31 26 32 23 33v14L0 24 23 2v13c12 0 18 5 18 6 14 11 11 27 11 27v3zM26 31c5 0 16 2 24 14 1-5 0-15-10-23 0 0-6-5-18-5h-1V6L3 24l18 18V31h5z"/>
  </svg>
`.trim();

export class TitleBar extends BaseComponent {
  static handleMenuButtonClick(e) {
    BaseComponent.eventPreventAndStop(e);

    window.xState.set(
      '_menu',
      !window.xState.get('_menu')
    );
  }

  static handleMapButtonClick(e) {
    BaseComponent.eventPreventAndStop(e);

    window.xState.set(
      '_selectedRoom',
      mapId
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

  handleBackButtonClick(e) {
    BaseComponent.eventPreventAndStop(e);

    window.xState.set(
      '_selectedRoom',
      this.lastRoomId
    );
  }

  create() {
    this.lastRoomId = null;

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
        h('div', { id: 'wait' }),
        h('h1', { id: 'room' }),
        h('div', { id: 'menubutton' }),
        h('div', { id: 'mapbutton' }),
        h('div', { id: 'backbutton' })
      ])
    );

    this.get('#wait').innerHTML = spinnerSVG;
    this.get('#menubutton').innerHTML = menuButtonSVG;
    this.get('#mapbutton').innerHTML = mapButtonSVG;
    this.get('#backbutton').innerHTML = backButtonSVG;

    this.get('#menubutton').addEventListener('mousedown', TitleBar.handleMenuButtonClick);
    this.get('#menubutton').addEventListener('touchstart', TitleBar.handleMenuButtonClick);

    this.get('#mapbutton').addEventListener('mousedown', TitleBar.handleMapButtonClick);
    this.get('#mapbutton').addEventListener('touchstart', TitleBar.handleMapButtonClick);

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.get('#backbutton').addEventListener('mousedown', this.handleBackButtonClick);
    this.get('#backbutton').addEventListener('touchstart', this.handleBackButtonClick);
  }

  render() {
    const { id, stream = false } = this.props;
    if (id === undefined) return;

    if (id !== mapId) {
      this.lastRoomId = id;
    }

    const { sections = [] } = window.xHierarchy;
    const {
      [id]: {
        section = null
      } = {}
    } = [].concat(...sections);

    const displayName = window.xExpand(section) || '';

    this.get('#room').textContent = displayName;
    this.get('#wait').classList.toggle('hide', stream);
    this.get('#mapbutton').classList.toggle('hide', id === mapId);
    this.get('#backbutton').classList.toggle('hide', id !== mapId || this.lastRoomId === null);
  }

  destroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });

    this.get('#menubutton').removeEventListener('click', TitleBar.handleMenuButtonClick);
  }
}
