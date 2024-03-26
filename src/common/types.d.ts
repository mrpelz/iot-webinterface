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

export type API = {
  clearNotifications: (tags?: string[]) => Promise<void>;
  reload: () => Promise<void>;
  removeRegistration: () => Promise<void>;
  showNotification: ServiceWorkerRegistration['showNotification']
};
