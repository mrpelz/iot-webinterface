/* eslint-disable import/extensions */
import {
  BaseComponent,
  h,
  render
} from '../../dom.js';

const valueLoadingString = '…';

export class Metric extends BaseComponent {
  _handleValueChange(value) {
    if (value !== null) {
      const targetElement = this.get('#value');
      if (!targetElement) return;

      const newValue = (
        typeof value === 'number'
          ? this._valueFormat.format(value)
          : value
      );

      if (newValue === this._value) return;
      this._value = newValue;

      targetElement.textContent = this._value;
    }
  }

  create() {
    const {
      group: {
        elements: [element]
      }
    } = this.props;

    const {
      attributes: {
        get,
        label,
        showSubLabel,
        subLabel,
        unit
      },
      name
    } = element;

    this._value = null;
    this._valueFormat = new Intl.NumberFormat('de-DE');

    const displayLabel = window.xExpand(label) || '[none]';
    const displaySubLabel = window.xExpand(subLabel) || '[none]';
    const displayUnit = window.xExpand(unit);

    const nodes = [
      h(
        'div',
        {
          id: 'value'
        },
        valueLoadingString
      ),
      h(
        'div',
        {
          id: 'label'
        },
        displayLabel
      ),
      h(
        'div',
        {
          id: 'unit'
        },
        displayUnit
      )
    ];

    if (showSubLabel && subLabel) {
      nodes.push(h(
        'div',
        {
          id: 'sublabel'
        },
        displaySubLabel
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
  }

  destroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
