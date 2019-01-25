/* eslint-disable import/extensions */
import {
  BaseComponent,
  bem
} from '../../dom.js';

import {
  setElement
} from '../../network.js';

const activeClass = bem('extension', null, 'active');
const svgShadeActiveAttribute = 'x-active';
const svgShadeZoomAttribute = 'x-zoom';
const svgControlStateAttribute = 'x-state';

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
    window.xState.subscribe('*', (value, key) => {
      const elements = this.shadowRoot.querySelectorAll(`[data-element="${key}"]`);
      if (!elements.length) return;

      [...elements].forEach((element) => {
        if (value === null) {
          element.removeAttribute(svgControlStateAttribute);
        } else {
          element.setAttribute(svgControlStateAttribute, value);
        }
      });
    });

    const svg = this.shadowRoot.getElementById('svg');
    const controlContainer = this.shadowRoot.getElementById('control');
    const shadeContainer = this.shadowRoot.getElementById('shade');
    const clickContainer = this.shadowRoot.getElementById('click');

    [...controlContainer.children].forEach((child) => {
      if (!child) return;

      const {
        dataset: {
          settype,
          element: name
        } = {}
      } = child;

      if (!settype || !name) return;

      const handle = () => {
        switch (settype) {
          case 'trigger':
            setElement({
              name,
              value: true
            });
            break;
          default:
        }
      };

      child.addEventListener('click', handle);
    });

    svg.addEventListener('click', ({ target } = {}) => {
      if (!target) return;
      if (target.closest('#control')) return;

      const {
        dataset: {
          section
        } = {}
      } = target;

      [
        ...shadeContainer.children,
        ...clickContainer.children
      ].forEach((child) => {
        child.removeAttribute(svgShadeActiveAttribute);
      });

      svg.removeAttribute(svgShadeZoomAttribute);

      if (!section) return;

      svg.setAttribute(svgShadeZoomAttribute, section);

      const shade = this.shadowRoot.getElementById(`${section}_shade`);
      if (shade) shade.setAttribute(svgShadeActiveAttribute, '');

      const click = this.shadowRoot.getElementById(`${section}_click`);
      if (click) click.setAttribute(svgShadeActiveAttribute, '');
    });

    this.subscription = window.xState.subscribe(
      '_selectedRoom',
      this._handleSectionChange.bind(this)
    );
  }
}
