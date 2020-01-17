import {
  BaseComponent,
  h,
  render
} from '../../dom.js';

import {
  setElement
} from '../../network.js';

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

      const text = window.xExpand(value) || value;
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

    const groupString = window.xExpand(groupLabel || group);
    const subGroupString = window.xExpand(subGroup) || subGroup;

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
          get,
          label,
          subType
        } = {}
      } = element;

      const subKey = label || subType || 'value';

      if (get || label) {
        nodes.push(h(
          'div',
          {
            id: subKey
          },
          get ? valueLoadingString : (window.xExpand(label) || label)
        ));
      }

      if (get) {
        window.xState.subscribe(
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
          set
        } = {}
      } = element;

      return set;
    });

    if (settableElement) {
      this._addClickHandler(settableElement);
    }
  }
}
