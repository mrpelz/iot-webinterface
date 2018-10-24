/* eslint-disable import/extensions */
import {
  BaseComponent,
  h,
  render
} from '../../dom.js';

const valueLoadingString = '…';

export class Metric extends BaseComponent {
  create() {
    const {
      group: {
        elements: [element]
      }
    } = this.props;

    const {
      attributes: {
        label,
        showSubLabel,
        subLabel,
        unit
      }
    } = element;

    const {
      [label]: displayLabel = '[none]',
      [subLabel]: displaySubLabel = '[none]',
      [unit]: displayUnit = null
    } = window.componentStrings;

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
  }
}
