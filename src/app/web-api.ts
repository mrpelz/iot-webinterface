import { connectWorker } from './util/workers.js';
import { queryXPath, QueryXPathType } from './util/xpath.js';

type SetupMessage = {
  apiBaseUrl: string;
  interval: number;
};

type GetterCallback<T> = (value: T) => void;
type TreeCallback = (
  tree: HierarchyElementSystem,
  elements: HierarchyElement[],
) => void;
type StreamOnlineCallback = (online: boolean) => void;

type Getter = {
  remove: () => void;
};

export type Setter<T> = {
  remove: () => void;
  set: (value: T) => void;
};

export enum Levels {
  SYSTEM,
  HOME,
  BUILDING,
  FLOOR,
  ROOM,
  AREA,
  DEVICE,
  PROPERTY,
}

export enum ValueType {
  NULL,
  BOOLEAN,
  NUMBER,
  STRING,
  RAW,
}

export enum ParentRelation {
  META_RELATION,
  CONTROL_TRIGGER,
  CONTROL_EXTENSION,
  DATA_QUALIFIER,
  DATA_AGGREGATION_SOURCE,
}

export type MetaSystem = {
  id: string;
  level: Levels.SYSTEM;
};

export type MetaHome = {
  isPrimary?: true;
  level: Levels.HOME;
  name: string;
};

export type MetaBuilding = {
  isPrimary?: true;
  level: Levels.BUILDING;
  name: string;
};

export type MetaFloor = {
  isBasement?: true;
  isGroundFloor?: true;
  isPartiallyOutside?: true;
  isPrimary?: true;
  level: Levels.FLOOR;
  name: string;
};

export type MetaRoom = {
  isConnectingRoom?: true;
  isDaylit?: true;
  level: Levels.ROOM;
  name: string;
};

export type MetaArea = {
  level: Levels.AREA;
  name: string;
};

export type MetaDevice = {
  host?: string;
  identifier?: number[];
  isSubDevice?: true;
  level: Levels.DEVICE;
  name: string;
  port?: number;
  transportType?: string;
  type?: string;
};

type MetaProperty = {
  level: Levels.PROPERTY;
  name: string;
  parentRelation?: ParentRelation;
};

export type MetaPropertySensor = MetaProperty & {
  measured?: string;
  type: 'sensor';
  unit?: string;
  valueType: ValueType;
};

export type MetaPropertySensorDate = MetaPropertySensor & {
  unit: 'date';
};

export type MetaPropertyActuator = MetaProperty & {
  actuated?: string;
  type: 'actuator';
  valueType: ValueType;
};

export type Meta =
  | MetaSystem
  | MetaHome
  | MetaBuilding
  | MetaFloor
  | MetaRoom
  | MetaArea
  | MetaDevice
  | MetaPropertySensor
  | MetaPropertyActuator;

export type HierarchyChildren = Record<string, HierarchyElement>;

export type HierarchyElement = {
  children?: HierarchyChildren;
  get?: number;
  id: string;
  meta?: Meta;
  property: string;
  set?: number;
};

export type HierarchyElementWithMeta<T extends Meta = Meta> =
  HierarchyElement & { meta: T };

export type HierarchyElementSystem = HierarchyElementWithMeta<MetaSystem>;

export type HierarchyElementHome = HierarchyElementWithMeta<MetaHome>;

export type HierarchyElementBuilding = HierarchyElementWithMeta<MetaBuilding>;

export type HierarchyElementFloor = HierarchyElementWithMeta<MetaFloor>;

export type HierarchyElementRoom = HierarchyElementWithMeta<MetaRoom>;

export type HierarchyElementArea = HierarchyElementWithMeta<MetaArea>;

export type HierarchyElementDevice = HierarchyElementWithMeta<MetaDevice>;

export type HierarchyElementPropertySensor =
  HierarchyElementWithMeta<MetaPropertySensor>;

export type HierarchyElementPropertyActuator =
  HierarchyElementWithMeta<MetaPropertyActuator>;

export type HierarchyElementProperty =
  | HierarchyElementPropertySensor
  | HierarchyElementPropertyActuator;

enum ChildType {
  GETTER,
  SETTER,
}

enum WorkerMessageType {
  STREAM,
  TREE,
  CHILD_REQUEST,
}

type WorkerMessageInbound =
  | {
      online: boolean;
      type: WorkerMessageType.STREAM;
    }
  | {
      tree: string;
      type: WorkerMessageType.TREE;
    };

type WorkerMessageOutbound = {
  childType: ChildType;
  index: number;
  type: WorkerMessageType.CHILD_REQUEST;
};

enum ChildMessageType {
  CLOSE,
  GET,
  SET,
}

type GetterMessageOutbound = {
  type: ChildMessageType.CLOSE;
};

type GetterMessageInbound<T> = {
  type: ChildMessageType.GET;
  value: T;
};

type SetterMessageOutbound<T> =
  | {
      type: ChildMessageType.CLOSE;
    }
  | {
      type: ChildMessageType.SET;
      value: T;
    };

const CHECK_INTERVAL = 5000;

const webApiUrl = new URL('../workers/web-api.js', import.meta.url).href;

const domParser = new DOMParser();

export class WebApi {
  private _isStreamOnline?: boolean;
  private readonly _port?: MessagePort;
  private _streamOnlineCallback?: StreamOnlineCallback;
  private _tree?: XMLDocument;
  private _treeCallback?: TreeCallback;

  constructor(apiBaseUrl: string | null, debug: boolean) {
    this._port = connectWorker<SetupMessage>(
      webApiUrl,
      'web-api',
      {
        apiBaseUrl:
          apiBaseUrl === null ? new URL('/', location.href).href : apiBaseUrl,
        interval: CHECK_INTERVAL,
      },
      debug,
    );

    (() => {
      if (!this._port) return;

      this._port.addEventListener('message', ({ data }) => {
        const message = data as WorkerMessageInbound;

        // eslint-disable-next-line default-case
        switch (message.type) {
          case WorkerMessageType.STREAM: {
            if (debug) {
              // eslint-disable-next-line no-console
              console.info(`stream ${message.online ? 'online' : 'offline'}`);
            }

            this._isStreamOnline = message.online;
            this._streamOnlineCallback?.(message.online);
            return;
          }

          case WorkerMessageType.TREE: {
            if (debug) {
              // eslint-disable-next-line no-console
              console.info('web-api hierarchy:', message.tree);
            }

            this._tree = domParser.parseFromString(
              message.tree,
              'application/xml',
            );

            this._handleTreeSet();
          }
        }
      });
    })();
  }

  private _handleTreeSet(): void {
    if (!this._tree) return;

    console.log(this._tree);

    console.log(
      queryXPath(
        '//*[@level="SYSTEM"]',
        this._tree,
        QueryXPathType.ALL,
        Element,
      )?.map((node) => (node.cloneNode() as unknown as Element).outerHTML),
    );

    console.log(
      queryXPath(
        '//*[@level="HOME"]',
        this._tree,
        QueryXPathType.ALL,
        Element,
      )?.map((node) => (node.cloneNode() as unknown as Element).outerHTML),
    );

    console.log(
      queryXPath(
        '//*[@level="BUILDING"]',
        this._tree,
        QueryXPathType.ALL,
        Element,
      )?.map((node) => (node.cloneNode() as unknown as Element).outerHTML),
    );

    console.log(
      queryXPath(
        '//*[@level="FLOOR"]',
        this._tree,
        QueryXPathType.ALL,
        Element,
      )?.map((node) => (node.cloneNode() as unknown as Element).outerHTML),
    );

    console.log(
      queryXPath(
        '//*[@level="ROOM"]',
        this._tree,
        QueryXPathType.ALL,
        Element,
      )?.map((node) => (node.cloneNode() as unknown as Element).outerHTML),
    );

    console.log(
      queryXPath(
        '//*[@level="ROOM"]',
        this._tree,
        QueryXPathType.ALL,
        Element,
      )?.map((node) => (node.cloneNode() as unknown as Element).outerHTML),
    );

    console.log(
      queryXPath(
        '//*[@species="door"]',
        this._tree,
        QueryXPathType.ALL,
        Element,
      )?.map((node) => (node.cloneNode() as unknown as Element).outerHTML),
    );

    // this._treeCallback?.(this._tree, elements);
  }

  createGetter<T>(index: number, callback: GetterCallback<T>): Getter | null {
    if (!this._port) return null;

    const { port1, port2 } = new MessageChannel();

    const request: WorkerMessageOutbound = {
      childType: ChildType.GETTER,
      index,
      type: WorkerMessageType.CHILD_REQUEST,
    };

    this._port.postMessage(request, [port2]);
    port1.start();

    const remove = () => {
      const message: GetterMessageOutbound = { type: ChildMessageType.CLOSE };
      port1.postMessage(message);
    };

    addEventListener('unload', remove, {
      once: true,
      passive: true,
    });

    port1.addEventListener('message', ({ data }) => {
      const { type, value } = data as GetterMessageInbound<T>;
      if (type !== ChildMessageType.GET) return;

      callback(value);
    });

    return {
      remove,
    };
  }

  createSetter<T>(index: number): Setter<T> | null {
    if (!this._port) return null;

    const { port1, port2 } = new MessageChannel();

    const request: WorkerMessageOutbound = {
      childType: ChildType.SETTER,
      index,
      type: WorkerMessageType.CHILD_REQUEST,
    };

    this._port.postMessage(request, [port2]);
    port1.start();

    const set = (value: T) => {
      const message: SetterMessageOutbound<T> = {
        type: ChildMessageType.SET,
        value,
      };
      port1.postMessage(message);
    };

    const remove = () => {
      const message: SetterMessageOutbound<T> = {
        type: ChildMessageType.CLOSE,
      };
      port1.postMessage(message);
    };

    addEventListener('unload', remove, {
      once: true,
      passive: true,
    });

    return {
      remove,
      set,
    };
  }

  onHierarchy(callback: TreeCallback): void {
    const hasCallbackSet = Boolean(this._treeCallback);

    this._treeCallback = callback;

    if (!hasCallbackSet) {
      this._handleTreeSet();
    }
  }

  onStreamOnline(callback: StreamOnlineCallback): void {
    const hasCallbackSet = Boolean(this._streamOnlineCallback);

    this._streamOnlineCallback = callback;

    if (!hasCallbackSet && this._isStreamOnline !== undefined) {
      this._streamOnlineCallback?.(this._isStreamOnline);
    }
  }
}

export const isElementWithMeta = (
  element: HierarchyElement,
): element is HierarchyElementWithMeta => Boolean(element?.meta);

export const isMetaSystem = (meta: Meta | undefined): meta is MetaSystem =>
  meta?.level === Levels.SYSTEM;

export const isMetaHome = (meta: Meta | undefined): meta is MetaHome =>
  meta?.level === Levels.HOME;

export const isMetaBuilding = (meta: Meta | undefined): meta is MetaBuilding =>
  meta?.level === Levels.BUILDING;

export const isMetaFloor = (meta: Meta | undefined): meta is MetaFloor =>
  meta?.level === Levels.FLOOR;

export const isMetaRoom = (meta: Meta | undefined): meta is MetaRoom =>
  meta?.level === Levels.ROOM;

export const isMetaArea = (meta: Meta | undefined): meta is MetaArea =>
  meta?.level === Levels.AREA;

export const isMetaDevice = (meta: Meta | undefined): meta is MetaDevice =>
  meta?.level === Levels.DEVICE;

export const isMetaPropertySensor = (
  meta: Meta | undefined,
): meta is MetaPropertySensor =>
  meta?.level === Levels.PROPERTY && meta.type === 'sensor';

export const isMetaPropertyActuator = (
  meta: Meta | undefined,
): meta is MetaPropertyActuator =>
  meta?.level === Levels.PROPERTY && meta.type === 'actuator';

export const isMetaPropertySensorDate = (
  meta: Meta | undefined,
): meta is MetaPropertySensorDate =>
  isMetaPropertySensor(meta) && meta.unit === 'date';

export const levelToString = (input: Levels): string | null => {
  switch (input) {
    case Levels.SYSTEM: {
      return 'SYSTEM';
    }
    case Levels.HOME: {
      return 'HOME';
    }
    case Levels.BUILDING: {
      return 'BUILDING';
    }
    case Levels.FLOOR: {
      return 'FLOOR';
    }
    case Levels.ROOM: {
      return 'ROOM';
    }
    case Levels.AREA: {
      return 'AREA';
    }
    case Levels.DEVICE: {
      return 'DEVICE';
    }
    case Levels.PROPERTY: {
      return 'PROPERTY';
    }
    default: {
      return null;
    }
  }
};

export const valueTypeToType = (
  input: ValueType,
):
  | 'null'
  | 'string'
  | 'number'
  | 'bigint'
  | 'boolean'
  | 'symbol'
  | 'undefined'
  | 'object'
  | 'function' => {
  switch (input) {
    case ValueType.NULL: {
      return 'null';
    }
    case ValueType.BOOLEAN: {
      return 'boolean';
    }
    case ValueType.NUMBER: {
      return 'number';
    }
    case ValueType.STRING: {
      return 'string';
    }
    default: {
      return 'object';
    }
  }
};

export const typeToValueType = (input: unknown): ValueType => {
  if (input === null) return ValueType.NULL;

  switch (typeof input) {
    case 'boolean': {
      return ValueType.BOOLEAN;
    }
    case 'number': {
      return ValueType.NUMBER;
    }
    case 'string': {
      return ValueType.STRING;
    }
    default: {
      return ValueType.RAW;
    }
  }
};

export const parentRelationToString = (
  input: ParentRelation,
): string | null => {
  switch (input) {
    case ParentRelation.META_RELATION: {
      return 'META_RELATION';
    }
    case ParentRelation.CONTROL_TRIGGER: {
      return 'CONTROL_TRIGGER';
    }
    case ParentRelation.CONTROL_EXTENSION: {
      return 'CONTROL_EXTENSION';
    }
    case ParentRelation.DATA_QUALIFIER: {
      return 'DATA_QUALIFIER';
    }
    case ParentRelation.DATA_AGGREGATION_SOURCE: {
      return 'DATA_AGGREGATION_SOURCE';
    }
    default: {
      return null;
    }
  }
};

export const getElementsFromLevel = <T extends HierarchyElementWithMeta>(
  input: (HierarchyElement | null)[],
  level: T['meta']['level'],
  deep = false,
  skipInput = false,
): T[] => {
  const filteredInput = input.filter((value): value is HierarchyElement =>
    Boolean(value),
  );

  const result = new Set<T>();

  const get = (elements: HierarchyElement[]) => {
    if (elements !== filteredInput || !skipInput) {
      for (const element of elements) {
        if (element?.meta?.level !== level) continue;
        result.add(element as T);
      }
    }

    if (result.size === 0 || deep) {
      for (const element of elements) {
        get(Object.values(element?.children || {}));
      }
    }
  };

  get(filteredInput);

  return Array.from(result);
};

type GroupByResult<
  T extends HierarchyElementWithMeta,
  K extends keyof Required<T['meta']>,
> = {
  elements: T[];
  group: T['meta'][K];
}[];

export const groupBy = <
  T extends HierarchyElementWithMeta,
  K extends keyof Required<T['meta']>,
>(
  input: readonly T[],
  property: K,
): GroupByResult<T, K> => {
  const keys = new Set<T['meta'][K]>();

  for (const { meta } of input) {
    keys.add((meta as T['meta'])[property]);
  }

  const result: GroupByResult<T, K> = [];

  for (const key of keys) {
    result.push({
      elements: input.filter(
        ({ meta }) => property in meta && (meta as T['meta'])[property] === key,
      ),
      group: key,
    });
  }

  return result;
};

export const sortBy = <
  T extends HierarchyElementWithMeta,
  K extends keyof Required<T['meta']>,
>(
  input: readonly T[],
  property: K,
  list: readonly T['meta'][K][],
): Record<'all' | 'listedResults' | 'unlistedResults', T[]> => {
  const listedResultsCollection: T[][] = [];

  for (const listItem of list) {
    const match = input.filter(
      ({ meta }) =>
        property in meta && (meta as T['meta'])[property] === listItem,
    );
    if (match.length === 0) continue;

    listedResultsCollection.push(match);
  }

  const listedResults = listedResultsCollection.flat(1);

  const unlistedResults: T[] = [];

  for (const inputItem of input) {
    const { meta } = inputItem;

    if (!(property in meta)) continue;

    const value = (meta as T['meta'])[property];
    if (!value) continue;
    if (list.includes(value)) continue;

    unlistedResults.push(inputItem);
  }

  return {
    get all() {
      return [listedResults, unlistedResults].flat(1);
    },
    listedResults,
    unlistedResults,
  };
};
