/* eslint-disable import/extensions */
import {
  BaseComponent,
  bem,
  c,
  render
} from '../../dom.js';

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

export class PageContainer extends BaseComponent {
  _handleRoomChange(index) {
    const { sections } = window.componentHierarchy;
    const { section = null } = sections[index] || {};

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

    if (window.componentState.get('_hasValues')) {
      backgroundImage.src = backgroundUrl;
    } else {
      this.deferred = window.componentState.subscribe('_hasValues', (is) => {
        if (!is) return;

        backgroundImage.src = backgroundUrl;
        this.deferred = null;
      });
    }
  }

  create() {
    const { sections = [] } = window.componentHierarchy;
    const elementNodes = sections.map((section, id) => {
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

    this.subscription = window.componentState.subscribe(
      '_selectedRoom',
      this._handleRoomChange.bind(this)
    );
  }

  destroy() {
    this.subscription.unsubscribe();
  }
}
