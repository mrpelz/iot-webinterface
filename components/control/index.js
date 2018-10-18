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

    const { group: { elements: [element] } } = this.props;
    const { name } = element;

    const value = window.componentState.get(name);

    if (!(value === true || value === false)) return;

    setElement({
      name,
      value: !value
    });
  }

  _handleValueChange(value) {
    if (value !== null) {
      this.get('#value').textContent = value;
    }
  }

  create() {
    const { group: { name, elements: [element] } } = this.props;
    const { name: id } = element;

    const {
      controls: {
        [name]: displayLabel = '[none]'
      },
      units: {
        [name]: displayUnit
      }
    } = window.componentStrings;

    const nodes = [
      h(
        'div',
        {},
        displayLabel
      ),
      h(
        'div',
        {
          id: 'value'
        },
        '--'
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
      id,
      this._handleValueChange.bind(this)
    );
  }

  destroy() {
    this.removeEventListener('click', this._handleClick);
    this.subscription.unsubscribe();
  }
}
