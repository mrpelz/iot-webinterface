/* eslint-disable import/extensions */
import {
  h,
  render
} from '../../dom.js';

import {
  Switch
} from '../switch/index.js';

const digits = {
  lux: 2,
  hpa: 0,
  ppm: 0
};

export class Metric extends Switch {
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

    if (!metricElement) return;

    const {
      attributes: {
        label,
        subType,
        unit
      }
    } = metricElement;

    const subKey = label || subType || 'value';

    const formatDigits = digits[unit] === undefined ? 1 : digits[unit];
    const { format } = new Intl.NumberFormat(
      'de-DE',
      {
        minimumFractionDigits: formatDigits,
        maximumFractionDigits: formatDigits,
        useGrouping: false
      }
    );

    this.props.formatter = {
      [subKey]: format
    };

    super.create();

    const displayUnit = window.xExpand(unit);
    this.appendChild(render(h(
      'div',
      {
        id: 'unit'
      },
      displayUnit
    )));
  }
}
