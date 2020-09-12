import {
  BaseComponent,
  h,
  render
} from '../../dom.js';

import {
  expand,
  setElement
} from '../../network.js';
import { state } from '../../index.js';

const valueLoadingString = '…';

export class Switch extends BaseComponent {
  _update(name) {
    return (input) => {
      const target = this.get(`#${name}`);
      if (!target) return;

      const {
        formatter: {
          [name]: formatter
        } = {}
      } = this.props;

      let value = '';
      if (formatter) {
        value = formatter(input);
      } else if (input !== false) {
        value = input.toString();
      }

      if (this.getAttribute(name) !== value) {
        this.setAttribute(name, value);
      }

      const text = expand(value) || value;
      if (target.textContent !== text) {
        target.textContent = text;
      }
    };
  }

  create() {
    const {
      group: {
        elements,
        group,
        groupLabel,
        showSubGroup,
        subGroup
      }
    } = this.props;

    const groupString = expand(groupLabel || group);
    const subGroupString = expand(subGroup) || subGroup;

    const nodes = [];

    if (group) {
      nodes.push(h(
        'div',
        {
          id: 'label'
        },
        groupString
      ));
    }

    if (showSubGroup && subGroup) {
      nodes.push(h(
        'div',
        {
          id: 'sublabel'
        },
        subGroupString
      ));
    }

    elements.forEach((element) => {
      const {
        name,
        attributes: {
          get = null,
          label = null,
          subType = null
        } = {}
      } = element;

      const subKey = label || subType || 'value';

      if (get || label) {
        nodes.push(h(
          'div',
          {
            id: subKey
          },
          get ? valueLoadingString : (expand(label) || label)
        ));
      }

      if (get) {
        state.subscribe(
          name,
          this._update(subKey).bind(this)
        );
      }
    });

    this.appendChild(
      render(...nodes)
    );
  }
}

export class ClickableSwitch extends Switch {
  _addClickHandler(element) {
    this.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const { attributes: { set = false, setType = null }, name } = element;

      if (!set || !setType) return;

      switch (setType) {
        case 'trigger':
          setElement({
            name,
            value: true
          });
          break;
        default:
      }
    });
  }

  create() {
    this.classList.add('clickable');

    super.create();

    const {
      group: {
        elements
      }
    } = this.props;

    const settableElement = elements.find((element) => {
      const {
        attributes: {
          set = null
        } = {}
      } = element;

      return set;
    });

    if (settableElement) {
      this._addClickHandler(settableElement);
    }
  }
}
