import {
  BaseComponent,
  bem,
  c,
  render
} from '../../dom.js';
import { hierarchy } from '../../network.js';
import { state } from '../../index.js';

const backgroundClass = bem('page-container', null, 'background');
const backgroundImageUrl = (room) => {
  return `images/background/${
    room
      .replace('ä', 'ae')
      .replace('ö', 'oe')
      .replace('ü', 'ue')
      .replace('ß', 'ss')
      .toLowerCase()
    }.png`;
};

function getSectionExtension(section = {}) {
  const { categories = [] } = section;
  if (categories.length > 1) return false;

  const [category = {}] = categories;
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

export class PageContainer extends BaseComponent {
  static handleStrayClick(e) {
    if (!state.get('_menu')) return;

    BaseComponent.eventPreventAndStop(e);
    state.set('_menu', false);
  }

  _handleRoomChange(index) {
    const { sections } = hierarchy;
    const { section = null } = [].concat(...sections)[index] || {};

    if (this.deferred) {
      this.deferred.unsubscribe();
    }

    this.sectionName = section;

    const backgroundUrl = backgroundImageUrl(section);
    const backgroundImage = new Image();

    const handleBgReplace = ({ target, pseudoElement }) => {
      if (
        target !== this
        || pseudoElement !== '::before'
        || section !== this.sectionName
      ) return;

      this.removeEventListener('transitionend', handleBgReplace);

      this.backgroundStyle.innerHTML = (
        `:host::before{background-image:url(${backgroundUrl})}`
      );

      this.classList.add(backgroundClass);
    };

    const handleImageLoad = () => {
      if (this.classList.contains(backgroundClass)) {
        this.addEventListener('transitionend', handleBgReplace);
        this.classList.remove(backgroundClass);
      } else {
        handleBgReplace({ target: this, pseudoElement: '::before' });
      }
    };

    backgroundImage.addEventListener('load', handleImageLoad);
    backgroundImage.addEventListener('error', handleImageLoad);

    if (state.get('_values')) {
      backgroundImage.src = backgroundUrl;
    } else {
      this.deferred = state.subscribe('_values', (is) => {
        if (!is) return;

        backgroundImage.src = backgroundUrl;
        this.deferred = null;
      });
    }
  }

  create() {
    const { sections = [] } = hierarchy;
    const elementNodes = [].concat(...sections).map((section, id) => {
      const extension = getSectionExtension(section);
      if (extension) {
        return c(extension, {
          id,
          section
        });
      }

      return c(
        'page',
        {
          id,
          section
        }
      );
    });

    this.appendChild(
      render(...elementNodes)
    );

    this.backgroundStyle = document.createElement('style');
    this.shadowRoot.appendChild(this.backgroundStyle);

    this.subscription = state.subscribe(
      '_selectedRoom',
      this._handleRoomChange.bind(this)
    );

    this.addEventListener('click', PageContainer.handleStrayClick, {
      capture: true
    });
    this.addEventListener('touchend', PageContainer.handleStrayClick, {
      capture: true
    });
  }

  destroy() {
    this.subscription.unsubscribe();
  }
}
