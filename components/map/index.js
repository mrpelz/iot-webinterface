/* eslint-disable import/extensions */
import {
  BaseComponent,
  bem
} from '../../dom.js';

import { MobileZoom } from './mobile-zoom.js';

const viewBox = {
  x: 1578,
  y: 1483
};
const activeClass = bem('extension', null, 'active');

export class MapComponent extends BaseComponent {
  _handleSectionChange(value) {
    const { id } = this.props;

    if (id === value) {
      this.classList.add(activeClass);
      if (this.mz) {
        this.mz.reset();
      }
    } else {
      this.classList.remove(activeClass);
    }
  }

  create() {
    const svgGroup = this.shadowRoot.querySelector('.all');

    this.mz = new MobileZoom(
      this,
      (translation, distance) => {
        const { width, height } = svgGroup.getBoundingClientRect();

        const size = Math.min(width, height);
        const scale = Math.min(((distance * 2 / size) + 1) ** 2, 3);

        const translate = {
          x: Math.max(
            Math.min(
              (translation.x * 2 / width) * viewBox.x, viewBox.x / 2
            ), -viewBox.x / 2
          ),
          y: Math.max(
            Math.min(
              (translation.y * 2 / height) * viewBox.y, viewBox.y / 2
            ), -viewBox.y / 2
          )
        };

        const origin = {
          x: Math.max(Math.min((-translation.x * 2) + (width / 2), width), 0),
          y: Math.max(Math.min((-translation.y * 2) + (height / 2), height), 0)
        };

        svgGroup.style.transformOrigin = `${origin.x}px ${origin.y}px`;
        svgGroup.style.transform = [
          `scale(${scale})`,
          `translate(${translate.x}px, ${translate.y}px)`
        ].join(' ');
      }
    );

    window.xState.subscribe('*', (value, key) => {
      const element = this.shadowRoot.getElementById(key);
      if (!element) return;

      element.setAttribute('state', value);
    });

    this.subscription = window.xState.subscribe(
      '_selectedRoom',
      this._handleSectionChange.bind(this)
    );
  }
}
