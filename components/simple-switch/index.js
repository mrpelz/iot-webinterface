/* eslint-disable import/extensions */
import {
  BaseComponent,
  bem,
  h,
  render
} from '../../dom.js';

const valueLoadingString = '…';
const clickableClass = bem('control', null, 'click');

export class SimpleSwitch extends BaseComponent {
  _handleValueChange(value) {
    if (value !== null) {
      const targetElement = this.get('#value');
      if (!targetElement) return;

      if (value === this._value) return;
      this._value = value;

      targetElement.textContent = this._value;
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

    const displayLabel = window.xExpand(key) || '[none]';
    const displaySubLabel = window.xExpand(subLabel) || '[none]';
    const displayUnit = window.xExpand(unit);

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
        valueLoadingString
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

    if (get) {
      this.subscription = window.componentState.subscribe(
        name,
        this._handleValueChange.bind(this)
      );
    }

    if (set) {
      this.classList.add(clickableClass);
    }
  }

  destroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
