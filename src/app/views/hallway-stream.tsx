import { FunctionComponent } from 'preact';
import { HLSStream } from './hls-stream.js';
import { isProd } from '../util/update.js';
import { useSegment } from '../state/path.js';

export const HallwayStream: FunctionComponent = () => {
  const [subRoute] = useSegment(1);

  return (
    <HLSStream
      poster={
        isProd ? 'https://nvr.i.wurstsalat.cloud/flur/still/jpg/' : undefined
      }
      src={
        subRoute || !isProd
          ? undefined
          : 'https://nvr.i.wurstsalat.cloud/flur/stream/'
      }
    />
  );
};
