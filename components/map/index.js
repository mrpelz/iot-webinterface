/* eslint-disable import/extensions */
import {
  BaseComponent,
  bem
} from '../../dom.js';

const activeClass = bem('extension', null, 'active');
const svgShadeActiveAttribute = 'x-active';
const svgShadeZoomAttribute = 'x-zoom';

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
      const element = this.shadowRoot.getElementById(key);
      if (!element) return;

      element.setAttribute('state', value);
    });

    const svg = this.shadowRoot.getElementById('svg');
    const shadeContainer = this.shadowRoot.getElementById('shade');
    const clickContainer = this.shadowRoot.getElementById('click');

    svg.addEventListener('click', ({ target } = {}) => {
      if (!target) return;

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
