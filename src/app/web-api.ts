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

export type HierarchyElement = {
  children?: Record<string, HierarchyElement>;
  get?: number;
  meta: Meta;
  set?: number;
};

const CLOSE_CHILD = '880E1EE9-15A2-462D-BCBC-E09630A1CFBB';
const STREAM_ONLINE = 'B41F5C2A-3F67-449F-BF91-37A3153FFFE9';
const STREAM_OFFLINE = '4A999429-B64A-4426-9818-E68039EF022D';

export class WebApi {
  private _hierarchyCallback?: HierarchyCallback;
  private _isStreamOnline = false;
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
    this._hierarchyCallback = callback;
  }

  onStreamOnline(callback: StreamOnlineCallback): void {
    const hasCallbackSet = Boolean(this._streamOnlineCallback);

    this._streamOnlineCallback = callback;

    if (!hasCallbackSet) {
      this._streamOnlineCallback?.(this._isStreamOnline);
    }
  }
}

export function isMetaSystem(element: Meta): element is MetaSystem {
  return element.level === Levels.SYSTEM;
}

export function isMetaHome(element: Meta): element is MetaHome {
  return element.level === Levels.HOME;
}

export function isMetaBuilding(element: Meta): element is MetaBuilding {
  return element.level === Levels.BUILDING;
}

export function isMetaFloor(element: Meta): element is MetaFloor {
  return element.level === Levels.FLOOR;
}

export function isMetaRoom(element: Meta): element is MetaRoom {
  return element.level === Levels.ROOM;
}

export function isMetaArea(element: Meta): element is MetaArea {
  return element.level === Levels.AREA;
}

export function isMetaDevice(element: Meta): element is MetaDevice {
  return element.level === Levels.DEVICE;
}

export function isMetaPropertySensor(
  element: Meta
): element is MetaPropertySensor {
  return element.level === Levels.PROPERTY && element.type === 'sensor';
}

export function isMetaPropertyActuator(
  element: Meta
): element is MetaPropertyActuator {
  return element.level === Levels.PROPERTY && element.type === 'actuator';
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

export function valueTypeToType(input: ValueType): string {
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
