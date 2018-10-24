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

  _handleValueChange(value) {
    if (value !== null) {
      const targetElement = this.get('#value');
      if (!targetElement) return;

      targetElement.textContent = (
        typeof value === 'number'
          ? window.componentNumberFormat.format(value)
          : value
      );
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
        get,
        set,
        type
      },
      name
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

    if (get) {
      this.subscription = window.componentState.subscribe(
        name,
        this._handleValueChange.bind(this)
      );
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
        get,
        set
      }
    } = element;

    if (set) {
      this.removeEventListener('click', this._handleClick);
    }
    if (get) {
      this.subscription.unsubscribe();
    }
  }
}
