import { connectWorker, webApiUrl } from './util/workers.js';

type SetupMessage = {
  apiBaseUrl: string;
  interval: number;
};

type GetterCallback<T> = (value: T) => void;
type HierarchyCallback = (value: HierarchyElementSystem) => void;
type StreamOnlineCallback = (online: boolean) => void;

type Getter = {
  remove: () => void;
};

type Setter<T> = {
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
  isSubDevice?: true;
  level: Levels.DEVICE;
  name: string;
};

type MetaProperty = {
  level: Levels.PROPERTY;
  name?: string;
  parentRelation?: ParentRelation;
};

export type MetaPropertySensor = MetaProperty & {
  measured?: string;
  type: 'sensor';
  unit?: string;
  valueType: ValueType;
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
  meta?: Meta;
  set?: number;
};

export type HierarchyElementWithMeta<T = Meta> = HierarchyElement & { meta: T };

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
  HIERARCHY,
  CHILD_REQUEST,
}

type WorkerMessageInbound =
  | {
      online: boolean;
      type: WorkerMessageType.STREAM;
    }
  | {
      hierarchy: HierarchyElementSystem;
      type: WorkerMessageType.HIERARCHY;
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

export class WebApi {
  private _hierarchy?: HierarchyElementSystem;
  private _hierarchyCallback?: HierarchyCallback;
  private _isStreamOnline?: boolean;
  private readonly _port: MessagePort | null;
  private _streamOnlineCallback?: StreamOnlineCallback;

  constructor(
    apiBaseUrl: string | null,
    interval: number | null,
    debug: boolean
  ) {
    this._port = connectWorker<SetupMessage>(
      webApiUrl,
      'web-api',
      {
        apiBaseUrl:
          apiBaseUrl === null ? new URL('/', location.href).href : apiBaseUrl,
        interval: interval || CHECK_INTERVAL,
      },
      debug
    );

    (() => {
      if (!this._port) return;

      this._port.onmessage = ({ data }) => {
        const message = data as WorkerMessageInbound;

        // eslint-disable-next-line default-case
        switch (message.type) {
          case WorkerMessageType.STREAM:
            if (debug) {
              // eslint-disable-next-line no-console
              console.info(`stream ${message.online ? 'online' : 'offline'}`);
            }

            this._isStreamOnline = message.online;
            this._streamOnlineCallback?.(message.online);
            return;

          case WorkerMessageType.HIERARCHY:
            if (debug) {
              // eslint-disable-next-line no-console
              console.info('web-api hierarchy:', message.hierarchy);
            }

            this._hierarchy = message.hierarchy;
            this._hierarchyCallback?.(message.hierarchy);
        }
      };
    })();
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

    port1.onmessage = ({ data }) => {
      const { type, value } = data as GetterMessageInbound<T>;
      if (type !== ChildMessageType.GET) return;

      callback(value);
    };

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

  onHierarchy(callback: HierarchyCallback): void {
    const hasCallbackSet = Boolean(this._hierarchyCallback);

    this._hierarchyCallback = callback;

    if (!hasCallbackSet && this._hierarchy) {
      this._hierarchyCallback?.(this._hierarchy);
      this._hierarchy = undefined;
    }
  }

  onStreamOnline(callback: StreamOnlineCallback): void {
    const hasCallbackSet = Boolean(this._streamOnlineCallback);

    this._streamOnlineCallback = callback;

    if (!hasCallbackSet && this._isStreamOnline !== undefined) {
      this._streamOnlineCallback?.(this._isStreamOnline);
      this._isStreamOnline = undefined;
    }
  }
}

export const isElementWithMeta = (
  element: HierarchyElement
): element is HierarchyElementWithMeta => {
  return Boolean(element?.meta);
};

export const isMetaSystem = (meta: Meta | undefined): meta is MetaSystem => {
  return meta?.level === Levels.SYSTEM;
};

export const isMetaHome = (meta: Meta | undefined): meta is MetaHome => {
  return meta?.level === Levels.HOME;
};

export const isMetaBuilding = (
  meta: Meta | undefined
): meta is MetaBuilding => {
  return meta?.level === Levels.BUILDING;
};

export const isMetaFloor = (meta: Meta | undefined): meta is MetaFloor => {
  return meta?.level === Levels.FLOOR;
};

export const isMetaRoom = (meta: Meta | undefined): meta is MetaRoom => {
  return meta?.level === Levels.ROOM;
};

export const isMetaArea = (meta: Meta | undefined): meta is MetaArea => {
  return meta?.level === Levels.AREA;
};

export const isMetaDevice = (meta: Meta | undefined): meta is MetaDevice => {
  return meta?.level === Levels.DEVICE;
};

export const isMetaPropertySensor = (
  meta: Meta | undefined
): meta is MetaPropertySensor => {
  return meta?.level === Levels.PROPERTY && meta.type === 'sensor';
};

export const isMetaPropertyActuator = (
  meta: Meta | undefined
): meta is MetaPropertyActuator => {
  return meta?.level === Levels.PROPERTY && meta.type === 'actuator';
};

export const isMetaPropertySensorDate = (
  meta: Meta | undefined
): meta is MetaPropertySensor => {
  return isMetaPropertySensor(meta) && meta.unit === 'date';
};

export const levelToString = (input: Levels): string | null => {
  switch (input) {
    case Levels.SYSTEM:
      return 'SYSTEM';
    case Levels.HOME:
      return 'HOME';
    case Levels.BUILDING:
      return 'BUILDING';
    case Levels.FLOOR:
      return 'FLOOR';
    case Levels.ROOM:
      return 'ROOM';
    case Levels.AREA:
      return 'AREA';
    case Levels.DEVICE:
      return 'DEVICE';
    case Levels.PROPERTY:
      return 'PROPERTY';
    default:
      return null;
  }
};

export const valueTypeToType = (
  input: ValueType
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
    case ValueType.NULL:
      return 'null';
    case ValueType.BOOLEAN:
      return 'boolean';
    case ValueType.NUMBER:
      return 'number';
    case ValueType.STRING:
      return 'string';
    case ValueType.RAW:
    default:
      return 'object';
  }
};

export const typeToValueType = (input: unknown): ValueType => {
  if (input === null) return ValueType.NULL;

  switch (typeof input) {
    case 'boolean':
      return ValueType.BOOLEAN;
    case 'number':
      return ValueType.NUMBER;
    case 'string':
      return ValueType.STRING;
    case 'object':
    default:
      return ValueType.RAW;
  }
};

export const parentRelationToString = (
  input: ParentRelation
): string | null => {
  switch (input) {
    case ParentRelation.META_RELATION:
      return 'META_RELATION';
    case ParentRelation.CONTROL_TRIGGER:
      return 'CONTROL_TRIGGER';
    case ParentRelation.CONTROL_EXTENSION:
      return 'CONTROL_EXTENSION';
    case ParentRelation.DATA_QUALIFIER:
      return 'DATA_QUALIFIER';
    case ParentRelation.DATA_AGGREGATION_SOURCE:
      return 'DATA_AGGREGATION_SOURCE';
    default:
      return null;
  }
};

export const getElementsFromLevel = <T extends HierarchyElementWithMeta>(
  input: (HierarchyElement | null)[],
  level: T['meta']['level'],
  deep = false,
  skipInput = false
): T[] => {
  const result = new Set<T>();

  const get = (elements: (HierarchyElement | null)[]) => {
    if (elements !== input || !skipInput) {
      for (const element of elements) {
        if (element?.meta?.level !== level) continue;
        result.add(element as T);
      }
    }

    if (!result.size || deep) {
      for (const element of elements) {
        get(Object.values(element?.children || {}));
      }
    }
  };

  get(input);

  return Array.from(result);
};

export const sortByName = <T extends HierarchyElementWithMeta>(
  input: T[],
  list: readonly string[]
): T[] => {
  const result: T[] = [];

  for (const listItem of list) {
    const match = input.find(
      ({ meta }) => 'name' in meta && meta.name === listItem
    );
    if (!match) continue;

    result.push(match);
  }

  result.push(
    ...input.filter(
      ({ meta }) => 'name' in meta && meta.name && !list.includes(meta.name)
    )
  );

  return result;
};
