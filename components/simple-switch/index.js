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
      }
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

    if (set) {
      this.classList.add(clickableClass);
    }
  }
}
