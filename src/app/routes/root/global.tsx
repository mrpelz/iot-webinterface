import { FunctionComponent } from 'preact';

import { HallwayStream } from '../../views/hallway-stream.js';
import { Room } from './room.js';

export const Global: FunctionComponent = () => (
  <Room elements={[...globalProperties, ...firstFloorProperties, entryDoor]}>
    <HallwayStream />
  </Room>
);
