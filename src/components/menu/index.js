import {
  BaseComponent,
  bem,
  c,
  h,
  render
} from '../../dom.js';
import { hierarchy } from '../../network.js';
import { state } from '../../index.js';

const menuActiveClass = bem('menu', null, 'active');

export class Menu extends BaseComponent {
  static hide() {
    state.set('_menu', false);
  }

  static handleDarkClick(e) {
    BaseComponent.eventPreventAndStop(e);

    state.set(
      '_darkMode',
      !state.get('_darkMode')
    );

    Menu.hide();
  }

  static handleReloadClick(e) {
    BaseComponent.eventPreventAndStop(e);

    state.set('_reload');
  }

  _handleMenu(menu) {
    this.setProps({
      menu
    });

    const listenerOpts = {
      once: true,
      passive: true
    };

    if (menu) {
      addEventListener('resize', Menu.hide, listenerOpts);
    } else {
      removeEventListener('resize', Menu.hide);
    }
  }

  create() {
    const { sections = [] } = hierarchy;
    const itemNodes = [].concat(...sections.map((sectionGroup, groupIndex) => {
      return [].concat(...sectionGroup.map((section, itemIndex) => {
        return {
          section,
          separated: (groupIndex && !itemIndex)
        };
      }));
    })).map(({ section, separated }, id) => {
      return c(
        'menu-element',
        {
          section,
          separated,
          id
        }
      );
    });

    this.subscriptions = [
      state.subscribe(
        '_menu',
        this._handleMenu.bind(this)
      )
    ];

    this.appendChild(
      render(...itemNodes)
    );

    this.shadowRoot.appendChild(
      render(
        h('div', { id: 'controls' }, [
          h(
            'div',
            { id: 'dark' },
            '💡'
          ),
          h(
            'div',
            { id: 'reload' },
            '🔄'
          )
        ])
      )
    );

    this.get('#dark').addEventListener('click', Menu.handleDarkClick);
    this.get('#reload').addEventListener('click', Menu.handleReloadClick);
  }

  render() {
    const { menu = false } = this.props;
    this.classList.toggle(menuActiveClass, menu);
  }

  destroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
