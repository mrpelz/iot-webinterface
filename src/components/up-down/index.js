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

export class UpDown extends BaseComponent {
  static findSubTypeElement(elements, subKey) {
    return elements.find((element) => {
      const {
        attributes: {
          subType = null
        } = {}
      } = element;

      return subType === subKey;
    });
  }

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

  _addClickHandler(element) {
    const {
      attributes: {
        set = false,
        setType = null,
        subType
      },
      name
    } = element;

    if (!subType) return;

    const clickElement = this.get(`#${subType}`);
    if (!clickElement) return;

    clickElement.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

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

    const readElement = UpDown.findSubTypeElement(elements, 'read');
    const upElement = UpDown.findSubTypeElement(elements, 'increase');
    const downElement = UpDown.findSubTypeElement(elements, 'decrease');

    if (!readElement || !upElement || !downElement) return;

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

    [readElement, upElement, downElement].forEach((element) => {
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

    if (readElement) {
      const {
        attributes: {
          unit = null
        } = {}
      } = readElement;

      if (unit) {
        nodes.push(h(
          'div',
          {
            id: 'unit'
          },
          expand(unit)
        ));
      }
    }

    this.appendChild(
      render(...nodes)
    );

    elements.forEach((element) => {
      const {
        attributes: {
          set = null
        } = {}
      } = element;

      if (set) {
        this._addClickHandler(element);
      }
    });
  }
}
