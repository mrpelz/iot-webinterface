import type { TSystem } from '@iot/iot-monolith';
import type { ElementSerialization } from '@iot/iot-monolith/tree-serialization';
import type { THierarchy } from './hierarchy.ts';

declare global {
  interface ServiceWorkerGlobalScope {
    __WB_DISABLE_DEV_LOGS?: boolean;
    __webpackServe__?: boolean;
  }
  interface Window {
    __version__?: string;
    __webpackServe__?: boolean;
  }
}

export type { TSystem };

// https://stackoverflow.com/a/50375286
export type UnionToIntersection<U> =
(U extends any ? (x: U)=>void : never) extends ((x: infer I)=>void) ? I : never;

export type Flags = {
  absoluteTimes: boolean;
  apiBaseUrl: string | null;
  debug: boolean;
  hallwayStreamEnable: boolean;
  inactivityTimeout: number | null;
  language: string | null;
  pagePersistence: boolean;
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
  clearStores: () => Promise<void>;
  init: () => Promise<void>;
  triggerCollector: <T>(reference: string, value: T) => Promise<void>;
};
