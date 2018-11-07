/* eslint-disable import/extensions */
import {
  BaseComponent,
  h,
  render
} from '../../dom.js';

const valueLoadingString = '…';
const openString = 'geöffnet';
const closedString = 'geschlossen';

export class Door extends BaseComponent {
  _handleValueChange(value) {
    if (value === null) return;

    const targetElement = this.get('#value');
    if (!targetElement) return;

    const newValue = value ? openString : closedString;

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
        label,
        showSubLabel,
        subLabel
      },
      name
    } = element;

    if (!get) return;

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
