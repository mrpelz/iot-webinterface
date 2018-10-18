/* eslint-disable import/extensions */
import {
  BaseComponent,
  c,
  render
} from '../../dom.js';

const animationDuration = 150;

function easing(t) {
  return t < 0.5 ? 2 * t * t : -1 + ((4 - (2 * t)) * t);
}

export class Menu extends BaseComponent {
  _animateScroll(to) {
    const start = Date.now();
    const from = this.scrollLeft;
    const distance = to - from;

    if (!distance) return;

    const tick = () => {
      const progress = Math.min(1, Math.max(0, (Date.now() - start) / animationDuration));
      const step = distance * easing(progress);

      this.scrollLeft = Math.max(0, from + step);

      if (progress >= 1) return;
      window.requestAnimationFrame(tick);
    };

    tick();
  }

  _handleSelectedChange(index) {
    if (!this.mediaQuery || this.mediaQuery.matches) return;

    window.setTimeout(() => {
      const { offsetLeft, scrollWidth } = this.childNodes[index];

      const scrollLeft = Math.min(
        this.scrollWidth - this.offsetWidth,
        Math.max(0, offsetLeft
          + (scrollWidth / 2)
          - (this.offsetWidth / 2))
      );

      if (!this.wasScrolled) {
        this.wasScrolled = true;
        this.scrollLeft = scrollLeft;

        return;
      }

      this._animateScroll(scrollLeft);
    }, 0);
  }

  create() {
    this.wasScrolled = false;

    const { rooms = [] } = window.componentHierarchy;
    const itemNodes = rooms.map((_, id) => {
      return c(
        'menu-element',
        { id }
      );
    });

    this.appendChild(
      render(...itemNodes)
    );

    this.subscription = window.componentState.subscribe(
      '_selectedRoom',
      this._handleSelectedChange.bind(this)
    );

    this.mediaQuery = window.matchMedia('screen and (min-width: 769px)');

    this._handleSelectedChange(
      window.componentState.get('_selectedRoom')
    );
  }

  destroy() {
    this.subscription.unsubscribe();
  }
}
