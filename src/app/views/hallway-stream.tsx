import { FunctionComponent } from 'preact';

import { HLSStream } from './hls-stream.js';

export const HallwayStream: FunctionComponent = () => (
  <HLSStream
    defaultActive
    poster="https://nvr.i.wurstsalat.cloud/flur/still/jpg/"
    src="https://nvr.i.wurstsalat.cloud/flur/stream/"
  />
);
