import { FunctionComponent } from 'preact';

import { $subPath } from '../state/path.js';
import { HLSStream } from './hls-stream.js';

export const HallwayStream: FunctionComponent = () => {
  const subRoute = $subPath.value;

  return (
    <HLSStream
      defaultActive
      poster="https://nvr.i.wurstsalat.cloud/flur/still/jpg/"
      src={subRoute || 'https://nvr.i.wurstsalat.cloud/flur/stream/'}
    />
  );
};
