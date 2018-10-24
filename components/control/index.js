/* eslint-disable import/extensions */
import {
  BaseComponent,
  bem,
  h,
  render
} from '../../dom.js';

import {
  setElement
} from '../../network.js';

const clickableClass = bem('control', null, 'click');

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
      this.get('#value').textContent = value;
    }
  }

  create() {
    const {
      group: {
        elements: [element],
        group
      }
    } = this.props;

    const {
      attributes: {
        get,
        label,
        set,
        showSubLabel,
        subLabel,
        unit
      },
      name
    } = element;

    const key = group || label;

    const {
      [key]: displayLabel = '[none]',
      [subLabel]: displaySubLabel = '[none]',
      [unit]: displayUnit = null
    } = window.componentStrings;

    const nodes = [h(
      'div',
      {},
      `${
        displayLabel
      }${
        set
          ? '⁺'
          : ''
      }${
        (showSubLabel && subLabel)
          ? ` (${displaySubLabel})`
          : ''
      }`
    )];

    if (get) {
      nodes.push(h(
        'div',
        {
          id: 'value'
        },
        '--'
      ));
    }

    if (displayUnit) {
      nodes.push(h(
        'div',
        {},
        displayUnit
      ));
    }

    this.appendChild(
      render(...nodes)
    );

    if (set) {
      this.classList.add(clickableClass);
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
