/* eslint-disable import/extensions */
import {
  BaseComponent,
  h,
  render
} from '../../dom.js';

const valueLoadingString = '…';

const states = {
  0: 'off',
  1: 'on',
  2: 'delayed-arm',
  3: 'triggered'
};

export class Security extends BaseComponent {
  _handleValueChange(value) {
    if (value === null) return;

    const targetElement = this.get('#value');
    if (!targetElement) return;

    const { [value]: key = states[0] } = states;
    this.classList = [key];

    const newValue = window.xExpand(key);

    if (newValue === this._value) return;

    this._value = newValue;
    targetElement.textContent = newValue;
  }

  create() {
    const {
      group: {
        elements
      }
    } = this.props;

    const [element] = elements;

    const {
      attributes: {
        get,
        set,
        label,
        showSubLabel,
        subLabel
      },
      name
    } = element;

    if (!get || !set) return;

    this._value = null;

    const displayLabel = window.xExpand(label) || '[none]';
    const displaySubLabel = window.xExpand(subLabel) || '[none]';

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
    if (this.subscriptions) {
      this.subscription.unsubscribe();
    }
  }
}
