import { FunctionComponent } from 'preact';

import { useSegment } from '../state/path.js';
import { HLSStream } from './hls-stream.js';

export const HallwayStream: FunctionComponent = () => {
  const [subRoute] = useSegment(1);

  return (
    <HLSStream
      poster={'https://nvr.i.wurstsalat.cloud/flur/still/jpg/'}
      src={subRoute || 'https://nvr.i.wurstsalat.cloud/flur/stream/'}
    />
  );
};
