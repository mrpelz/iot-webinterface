import {
  BaseComponent,
  h,
  render
} from '../../dom.js';

import {
  setElement
} from '../../network.js';

const valueLoadingString = '…';

export class UpDown extends BaseComponent {
  static findSubTypeElement(elements, subKey) {
    return elements.find((element) => {
      const {
        attributes: {
          subType
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

      const text = window.xExpand(value) || value;
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

    const groupString = window.xExpand(groupLabel || group);
    const subGroupString = window.xExpand(subGroup) || subGroup;

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

    if (readElement) {
      const {
        attributes: {
          unit
        } = {}
      } = readElement;

      if (unit) {
        nodes.push(h(
          'div',
          {
            id: 'unit'
          },
          window.xExpand(unit)
        ));
      }
    }

    this.appendChild(
      render(...nodes)
    );

    elements.forEach((element) => {
      const {
        attributes: {
          set
        } = {}
      } = element;

      if (set) {
        this._addClickHandler(element);
      }
    });
  }
}
