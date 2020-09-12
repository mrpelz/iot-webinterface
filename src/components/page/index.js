import {
  BaseComponent,
  bem,
  c,
  render
} from '../../dom.js';
import { state } from '../../index.js';

const activeClass = bem('page', null, 'active');

function getCategoryExtension(category = {}) {
  const { groups = [] } = category;
  if (groups.length > 1) return false;

  const [group = {}] = groups;
  const { elements = [] } = group;
  if (elements.length > 1) return false;

  const [element = {}] = elements;
  const { name, attributes: { isExtension = false } = {} } = element;
  if (!isExtension) return false;

  return name;
}

export class Page extends BaseComponent {
  _handleSectionChange(value) {
    const { id } = this.props;

    if (id === value) {
      this.classList.add(activeClass);
    } else {
      this.classList.remove(activeClass);
    }
  }

  create() {
    const {
      section: {
        categories = []
      }
    } = this.props;

    const elementNodes = categories.map((category) => {
      const extension = getCategoryExtension(category);
      if (extension) {
        return c(extension, { category });
      }

      return c(
        'category',
        { category }
      );
    });

    this.appendChild(
      render(...elementNodes)
    );

    this.subscription = state.subscribe(
      '_selectedRoom',
      this._handleSectionChange.bind(this)
    );
  }

  destroy() {
    this.subscription.unsubscribe();
  }
}
