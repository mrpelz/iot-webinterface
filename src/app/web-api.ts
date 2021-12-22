import { connectWorker, webApiUrl } from './util/workers.js';

type SetupMessage = {
  apiBaseUrl: string;
  interval: number;
};

enum ChildChannelType {
  GETTER,
  SETTER,
}

type ChildChannelRequest = [ChildChannelType, number];

type GetterCallback<T> = (value: T) => void;
type HierarchyCallback = (value: HierarchyElement) => void;
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

const CLOSE_CHILD = '880E1EE9-15A2-462D-BCBC-E09630A1CFBB';
const STREAM_ONLINE = 'B41F5C2A-3F67-449F-BF91-37A3153FFFE9';
const STREAM_OFFLINE = '4A999429-B64A-4426-9818-E68039EF022D';

export class WebApi {
  private _hierarchy?: HierarchyElement;
  private _hierarchyCallback?: HierarchyCallback;
  private _isStreamOnline?: boolean;
  private readonly _port: MessagePort | null;
  private _streamOnlineCallback?: StreamOnlineCallback;

  constructor(apiBaseUrl: string, interval: number, debug: boolean) {
    this._port = connectWorker<SetupMessage>(
      webApiUrl,
      'web-api',
      {
        apiBaseUrl,
        interval,
      },
      debug
    );

    (() => {
      if (!this._port) return;

      this._port.onmessage = ({ data }) => {
        if (data === STREAM_ONLINE) {
          if (debug) {
            // eslint-disable-next-line no-console
            console.info('stream online');
          }

          this._isStreamOnline = true;
          this._streamOnlineCallback?.(true);
          return;
        }

        if (data === STREAM_OFFLINE) {
          if (debug) {
            // eslint-disable-next-line no-console
            console.info('stream offline');
          }

          this._isStreamOnline = false;
          this._streamOnlineCallback?.(false);
          return;
        }

        if (debug) {
          // eslint-disable-next-line no-console
          console.info('web-api hierarchy:', data);
        }

        this._hierarchy = data;
        this._hierarchyCallback?.(data);
      };
    })();
  }

  createGetter<T>(index: number, callback: GetterCallback<T>): Getter | null {
    if (!this._port) return null;

    const { port1, port2 } = new MessageChannel();

    const request: ChildChannelRequest = [ChildChannelType.GETTER, index];

    this._port.postMessage(request, [port2]);
    port1.start();

    const remove = () => port1.postMessage(CLOSE_CHILD);

    addEventListener('unload', remove, {
      once: true,
      passive: true,
    });

    port1.onmessage = ({ data }) => {
      callback(data as T);
    };

    return {
      remove,
    };
  }

  createSetter<T>(index: number): Setter<T> | null {
    if (!this._port) return null;

    const { port1, port2 } = new MessageChannel();

    const request: ChildChannelRequest = [ChildChannelType.SETTER, index];

    this._port.postMessage(request, [port2]);
    port1.start();

    const set = (value: T) => {
      port1.postMessage(value);
    };

    const remove = () => port1.postMessage(CLOSE_CHILD);

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

export function isElementWithMeta(
  element: HierarchyElement
): element is HierarchyElementWithMeta {
  return Boolean(element?.meta);
}

export function isMetaSystem(meta: Meta | undefined): meta is MetaSystem {
  return meta?.level === Levels.SYSTEM;
}

export function isMetaHome(meta: Meta | undefined): meta is MetaHome {
  return meta?.level === Levels.HOME;
}

export function isMetaBuilding(meta: Meta | undefined): meta is MetaBuilding {
  return meta?.level === Levels.BUILDING;
}

export function isMetaFloor(meta: Meta | undefined): meta is MetaFloor {
  return meta?.level === Levels.FLOOR;
}

export function isMetaRoom(meta: Meta | undefined): meta is MetaRoom {
  return meta?.level === Levels.ROOM;
}

export function isMetaArea(meta: Meta | undefined): meta is MetaArea {
  return meta?.level === Levels.AREA;
}

export function isMetaDevice(meta: Meta | undefined): meta is MetaDevice {
  return meta?.level === Levels.DEVICE;
}

export function isMetaPropertySensor(
  meta: Meta | undefined
): meta is MetaPropertySensor {
  return meta?.level === Levels.PROPERTY && meta.type === 'sensor';
}

export function isMetaPropertyActuator(
  meta: Meta | undefined
): meta is MetaPropertyActuator {
  return meta?.level === Levels.PROPERTY && meta.type === 'actuator';
}

export function levelToString(input: Levels): string | null {
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
}

export function valueTypeToType(
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
  | 'function' {
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
}

export function typeToValueType(input: unknown): ValueType {
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
}

export function parentRelationToString(input: ParentRelation): string | null {
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
}

export function flatten<T extends HierarchyElement>(
  input: HierarchyElement
): T[] {
  const result = new Set<HierarchyElement>();

  const getChildren = (element: HierarchyElement) => {
    result.add(element);

    const { children } = element;
    if (!children) return;

    for (const child of Object.values(children)) {
      if (!('meta' in child)) return;

      getChildren(child);
    }
  };

  getChildren(input);

  return Array.from(result) as unknown as T[];
}

export function getElementsFromLevel<T extends HierarchyElementWithMeta>(
  input: HierarchyElement[],
  level: T['meta']['level']
): T[] {
  return input.filter((element): element is T => element.meta?.level === level);
}
