import { TSystem } from '@iot/iot-monolith';
import type { ElementSerialization } from '@iot/iot-monolith/tree-serialization';

export type { TSystem }
export type TSerialization = ElementSerialization<TSystem>

// https://stackoverflow.com/a/50375286
export type UnionToIntersection<U> =
(U extends any ? (x: U)=>void : never) extends ((x: infer I)=>void) ? I : never

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
  getValue: <T>(reference: string) => Promise<T | undefined>;
  readonly hierarchy: Promise<TSerialization>;
  readonly isInit: Promise<void>;
  isOnline: () => boolean;
  triggerCollector: <T>(reference: string, value: T) => Promise<void>;
};
