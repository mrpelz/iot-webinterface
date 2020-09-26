import {
  BaseComponent,
  bem
} from '../../dom.js';
import { expand } from '../../network.js';
import { state } from '../../index.js';

const activeClass = bem('menu', 'element', 'active');
const separatedClass = bem('menu', 'element', 'separated');

/**
 * @typedef MenuElementExtension
 * @type {MenuElement & {
 *  scrollIntoViewIfNeeded: () => void
 * }}
 */

export class MenuElement extends BaseComponent {
  _handleClick() {
    const { id } = this.props;
    state.set('_selectedRoom', id);
    state.set('_menu', false);
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
    if (!open || state.get('_selectedRoom') !== id) return;

    this._handleMenuScroll();
  }

  _handleMenuScroll() {
    const cutoffTop = this.offsetParent.scrollTop > this.offsetTop;
    const cutoffBottom = (
      this.offsetParent.scrollTop + this.offsetParent.clientHeight
    ) < (
      this.offsetTop + this.offsetHeight
    );

    if (cutoffTop) {
      this.offsetParent.scrollTo({
        top: this.offsetTop,
        behavior: 'smooth'
      });
    }

    if (cutoffBottom) {
      this.offsetParent.scrollTo({
        top: this.offsetTop + this.offsetHeight,
        behavior: 'smooth'
      });
    }
  }

  create() {
    const {
      section: { section = null } = {},
      separated
    } = this.props;

    const displayName = expand(section) || '';
    this.textContent = displayName;

    if (separated) {
      this.classList.add(separatedClass);
    }


    this.subscriptions = [
      state.subscribe(
        '_selectedRoom',
        this._handleSelectedChange.bind(this)
      ),
      state.subscribe(
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
