import { TSerialization } from '@iot/iot-monolith';

export type { TSerialization };
export type { TSystem } from '@iot/iot-monolith';

export type Flags = {
  absoluteTimes: boolean;
  apiBaseUrl: string | null;
  debug: boolean;
  inactivityTimeout: number | null;
  language: string | null;
  path: string | null;
  screensaverEnable: boolean;
  screensaverRandomizePosition: boolean;
  startPage: string | null;
  theme: string | null;
  updateCheckInterval: number | null;
  updateUnattended: boolean;
};

export type SW_API = {
  clearNotifications: (tags?: string[]) => Promise<void>;
  reload: () => Promise<void>;
  removeRegistration: () => Promise<void>;
  showNotification: ServiceWorkerRegistration['showNotification'];
};

export abstract class API_WORKER_API {
  init(): Promise<void>;
  get hierarchy(): TSerialization | undefined;
};
