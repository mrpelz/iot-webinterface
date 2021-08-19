import { connectWorker, webApiUrl } from './workers.js';
import { flags } from '../index.js';

type SetupMessage = { apiBaseUrl: string; lowPriorityStream: boolean };

export function webApi(): void {
  const { apiBaseUrl, lowPriorityStream } = flags;

  const port = connectWorker<SetupMessage>(webApiUrl, 'web-api', {
    apiBaseUrl,
    lowPriorityStream,
  });

  if (!port) return;

  port.onmessage = ({ data }) => {
    // eslint-disable-next-line no-console
    console.info('web-api:', data);
  };
}
