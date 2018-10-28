/* eslint-disable import/extensions */
import {
  BaseComponent,
  c,
  render
} from '../../dom.js';

import {
  setElement
} from '../../network.js';

export class Control extends BaseComponent {
  _handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    const { group: { elements: [element] } } = this.props;
    const { attributes: { set = false, setType = null }, name } = element;

    if (!set || !setType) return;

    switch (setType) {
      case 'trigger':
        setElement({
          name,
          value: true
        });
        break;
      default:
    }
  }

  create() {
    const {
      group,
      group: {
        elements: [element]
      }
    } = this.props;

    const {
      attributes: {
        set,
        type
      }
    } = element;

    let node = 'simple-switch';

    switch (type) {
      case 'environmental-sensor':
        node = 'metric';
        break;
      default:
    }

    this.appendChild(
      render(c(
        node,
        { group }
      ))
    );

    if (set) {
      this.addEventListener('click', this._handleClick);
    }
  }

  destroy() {
    const {
      group: {
        elements: [element]
      }
    } = this.props;

    const {
      attributes: {
        set
      }
    } = element;

    if (set) {
      this.removeEventListener('click', this._handleClick);
    }
  }
}
