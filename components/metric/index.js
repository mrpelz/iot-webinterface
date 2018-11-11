/* eslint-disable import/extensions */
import {
  BaseComponent,
  fontAutoSize,
  h,
  render
} from '../../dom.js';

const valueLoadingString = '…';
const digits = {
  brightness: 2,
  pressure: 0,
  eco2: 0,
  tvoc: 0
};

export class Metric extends BaseComponent {
  _handleValueChange(value) {
    if (value === null) return;

    const targetElement = this.get('#value');
    if (!targetElement) return;

    const newValue = (
      typeof value === 'number'
        ? this._valueFormat.format(value)
        : value.toString()
    );

    if (newValue === this._value) return;

    this._value = newValue;

    const {
      fontFamily,
      fontSize,
      marginLeft,
      marginRight
    } = window.getComputedStyle(targetElement);

    const size = fontAutoSize(
      newValue,
      fontFamily,
      Number.parseFloat(fontSize.replace('px', '')),
      (
        Number.parseFloat(this.computedStyle.width.replace('px', ''))
        - Number.parseFloat(marginLeft.replace('px', ''))
        - Number.parseFloat(marginRight.replace('px', ''))
      )
    );

    targetElement.style.fontSize = `${size}px`;
    targetElement.textContent = newValue;
  }

  _handleTrendChange(trend) {
    if (trend === null) return;

    const targetElement = this.get('#trend');
    if (!targetElement) return;

    targetElement.classList.toggle('active', trend !== 0);
    targetElement.textContent = {
      [-1]: '▼',
      1: '▲'
    }[trend] || '';
  }

  create() {
    const {
      group: {
        elements
      }
    } = this.props;

    const metricElement = elements.find((element) => {
      return (
        element.attributes.subType === 'single-sensor'
        || element.attributes.subType === 'aggregate-value'
      );
    });
    const trendElement = elements.find((element) => {
      return element.attributes.subType === 'trend';
    });

    if (!metricElement) return;

    const {
      attributes: {
        get,
        label,
        showSubLabel,
        subLabel,
        unit
      },
      name
    } = metricElement;

    this._value = null;

    const formatDigits = digits[label] === undefined ? 1 : digits[label];
    this._valueFormat = new Intl.NumberFormat(
      'de-DE',
      {
        minimumFractionDigits: formatDigits,
        maximumFractionDigits: formatDigits,
        useGrouping: false
      }
    );

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

    if (trendElement) {
      nodes.unshift(h(
        'div',
        {
          id: 'trend'
        }
      ));
    }

    this.appendChild(
      render(...nodes)
    );

    if (get) {
      this.subscriptions = [window.componentState.subscribe(
        name,
        this._handleValueChange.bind(this)
      )];
    }

    if (trendElement) {
      const {
        name: tName
      } = trendElement;

      this.subscriptions.push(
        window.componentState.subscribe(
          tName,
          this._handleTrendChange.bind(this)
        )
      );
    }
  }

  destroy() {
    if (this.subscriptions) {
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
    }
  }
}
