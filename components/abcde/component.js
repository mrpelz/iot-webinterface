/* eslint-disable import/extensions */
import {
  ShadowTemplatedComponent
} from '../../dom.js';

export class Abcde extends ShadowTemplatedComponent {
  constructor(template) {
    super(template);
    console.log(this);
  }
}
