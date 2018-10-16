/* eslint-disable import/extensions */
import {
  BaseComponent,
  h,
  render
} from '../../dom.js';

import {
  setElement
} from '../../network.js';

export class Control extends BaseComponent {
  _handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    const { elements: [element] } = this.props;
    const { name } = element;

    const value = window.componentState.get(name);

    if (!(value === true || value === false)) return;

    setElement({
      name,
      value: !value
    });
  }

  _handleChange(value) {
    this.get('#value').textContent = value;
  }

  create() {
    const { name: displayLabel, elements: [element] } = this.props;
    const { name, attributes: { displayUnit } } = element;

    const nodes = [
      h(
        'div',
        {},
        displayLabel
      ),
      h(
        'div', {
          id: 'value'
        },
        window.componentState.get(name)
      )
    ];

    if (displayUnit) {
      nodes.push(
        h(
          'div',
          {},
          displayUnit
        )
      );
    }

    this.appendChild(
      render(...nodes)
    );

    this.addEventListener('click', this._handleClick);

    this.subscription = window.componentState.subscribe(
      name,
      this._handleChange.bind(this)
    );
  }

  destroy() {
    this.removeEventListener('click', this._handleClick);
    this.subscription.unsubscribe();
  }
}
