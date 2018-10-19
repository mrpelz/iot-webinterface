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
    const { locations } = window.componentHierarchy;
    const { location = null } = locations[index] || {};

    if (this.deferred) {
      this.deferred.unsubscribe();
    }

    this.locationName = location;

    const backgroundUrl = backgroundImageUrl(location);
    const backgroundImage = new Image();

    const handleBgReplace = ({ target, pseudoElement }) => {
      if (
        target !== this
        || pseudoElement !== '::before'
        || location !== this.locationName
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
    const { locations = [] } = window.componentHierarchy;
    const elementNodes = locations.map((location, id) => {
      return c(
        'page',
        {
          id,
          location
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
