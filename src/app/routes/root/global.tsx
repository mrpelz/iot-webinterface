import {
  excludePattern,
  Level,
  levelObjectMatch,
} from '@iot/iot-monolith/tree';
import { FunctionComponent } from 'preact';

import { api } from '../../main.js';
import { HallwayStream } from '../../views/hallway-stream.js';
import { Room } from './room.js';

export const Global: FunctionComponent = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const object = api
    .match(levelObjectMatch[Level.SYSTEM], excludePattern)
    .at(0);
  if (!object) return null;

  return (
    <Room object={object}>
      <HallwayStream />
    </Room>
  );
};
