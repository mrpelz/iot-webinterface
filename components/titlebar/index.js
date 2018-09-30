/* eslint-disable import/extensions */
import {
  BaseComponent
} from '../../dom.js';

export class TitleBar extends BaseComponent {
  drawRoomTitle(title) {
    this.get('#room').textContent = title;
  }

  // drawFlags() {
  //   const flags = 
  //   this.get('#room').appendChild(
  //     document.createTextNode(this.props.room)
  //   );
  // }

  render() {
    this.drawRoomTitle();
    // this.drawFlags();
  }
}
