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
    } else {
      this.classList.remove(activeClass);
      this._resetZoom();
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

    this.svg = this.shadowRoot.getElementById('svg');
    this.controlContainer = this.shadowRoot.getElementById('control');
    this.shadeContainer = this.shadowRoot.getElementById('shade');
    this.clickContainer = this.shadowRoot.getElementById('click');

    this._setUpElementClickHandlers();

    this.svg.addEventListener('click', this._handleZoom.bind(this));

    this.subscription = window.xState.subscribe(
      '_selectedRoom',
      this._handleSectionChange.bind(this)
    );

    this.addEventListener('scroll', MapComponent.eventPreventAndStop);
    this.addEventListener('touchmove', MapComponent.eventPreventAndStop);
  }

  _resetZoom() {
    [
      ...this.shadeContainer.children,
      ...this.clickContainer.children
    ].forEach((child) => {
      child.removeAttribute(svgShadeActiveAttribute);
    });

    this.svg.removeAttribute(svgShadeZoomAttribute);
  }

  _setUpElementClickHandlers() {
    [...this.controlContainer.children].forEach((child) => {
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
  }

  _handleZoom({ target } = {}) {
    if (!target) return;
    if (target.closest('#control')) return;

    const {
      dataset: {
        section
      } = {}
    } = target;

    this._resetZoom();

    if (!section) return;

    this.svg.setAttribute(svgShadeZoomAttribute, section);

    const shade = this.shadowRoot.getElementById(`${section}_shade`);
    if (shade) shade.setAttribute(svgShadeActiveAttribute, '');

    const click = this.shadowRoot.getElementById(`${section}_click`);
    if (click) click.setAttribute(svgShadeActiveAttribute, '');
  }
}
