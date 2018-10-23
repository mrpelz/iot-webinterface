/* eslint-disable import/extensions */
import {
  BaseComponent,
  bem
} from '../../dom.js';

const activeClass = bem('menu', 'element', 'active');

export class MenuElement extends BaseComponent {
  _handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    const { id } = this.props;
    window.componentState.set('_selectedRoom', id);
  }

  _handleSelectedChange(index) {
    const { id } = this.props;

    if (id === index) {
      this.classList.add(activeClass);
    } else {
      this.classList.remove(activeClass);
    }
  }

  create() {
    const {
      section: { section } = {}
    } = this.props;

    const {
      sections: {
        [section]: displayName
      }
    } = window.componentStrings;

    this.textContent = displayName;

    this._handleClick = this._handleClick.bind(this);
    this._handleSelectedChange = this._handleSelectedChange.bind(this);

    this.addEventListener('click', this._handleClick);

    this.subscription = window.componentState.subscribe(
      '_selectedRoom',
      this._handleSelectedChange
    );
  }

  destroy() {
    this.removeEventListener('click', this._handleClick);
    this.subscription.unsubscribe();
  }
}
