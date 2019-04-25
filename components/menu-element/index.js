/* eslint-disable import/extensions */
import {
  BaseComponent,
  bem
} from '../../dom.js';

const activeClass = bem('menu', 'element', 'active');
const separatedClass = bem('menu', 'element', 'separated');

export class MenuElement extends BaseComponent {
  _handleClick() {
    const { id } = this.props;
    window.xState.set('_selectedRoom', id);
    window.xState.set('_menu', false);
  }

  _handleSelectedChange(index) {
    const { id } = this.props;

    if (id === index) {
      this.classList.add(activeClass);
    } else {
      this.classList.remove(activeClass);
    }
  }

  _handleMenu(open) {
    const { id } = this.props;
    if (!open || window.xState.get('_selectedRoom') !== id) return;

    if (typeof this.scrollIntoViewIfNeeded === 'function') {
      this.scrollIntoViewIfNeeded();
    } else {
      this.scrollIntoView();
    }
  }

  create() {
    const {
      section: { section } = {},
      separated
    } = this.props;

    const displayName = window.xExpand(section) || '';
    this.textContent = displayName;

    if (separated) {
      this.classList.add(separatedClass);
    }


    this.subscriptions = [
      window.xState.subscribe(
        '_selectedRoom',
        this._handleSelectedChange.bind(this)
      ),
      window.xState.subscribe(
        '_menu',
        this._handleMenu.bind(this)
      )
    ];

    this.addEventListener('click', this._handleClick.bind(this));
  }

  destroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
