type Failover<T, A, B> = T extends undefined ? B : A;

const {
  NUMBER_TYPE,
  STRING_TYPE,
  BOOLEAN_TYPE,
  ORDERED_NODE_SNAPSHOT_TYPE,
  FIRST_ORDERED_NODE_TYPE,
} = XPathResult;

export enum QueryXPathType {
  NUMBER = NUMBER_TYPE,
  STRING = STRING_TYPE,
  BOOLEAN = BOOLEAN_TYPE,
  ALL = ORDERED_NODE_SNAPSHOT_TYPE,
  FIRST = FIRST_ORDERED_NODE_TYPE,
}

const primitiveResultKeys = {
  [QueryXPathType.NUMBER]: 'numberValue',
  [QueryXPathType.STRING]: 'stringValue',
  [QueryXPathType.BOOLEAN]: 'booleanValue',
} as const;

export const xPathEvaluator = new XPathEvaluator();

export function queryXPath(
  query: string | XPathExpression,
  context: Node,
  type: QueryXPathType.NUMBER,
): number | null;
export function queryXPath(
  query: string | XPathExpression,
  context: Node,
  type: QueryXPathType.STRING,
): string | null;
export function queryXPath(
  query: string | XPathExpression,
  context: Node,
  type: QueryXPathType.BOOLEAN,
): boolean | null;
export function queryXPath(
  query: string | XPathExpression,
  context: Node,
  type: QueryXPathType.ALL,
): Node[] | null;
export function queryXPath<Expect extends Node>(
  query: string | XPathExpression,
  context: Node,
  type: QueryXPathType.ALL,
  expect: new () => Expect,
): Expect[] | null;
export function queryXPath(
  query: string | XPathExpression,
  context: Node,
  type: QueryXPathType.FIRST,
): Node | null;
export function queryXPath<Expect extends Node>(
  query: string | XPathExpression,
  context: Node,
  type: QueryXPathType.FIRST,
  expect: new () => Expect,
): Expect | null;
export function queryXPath<Expect extends Node>(
  query: string | XPathExpression,
  context: Node,
  type: QueryXPathType = QueryXPathType.FIRST,
  expect?: new () => Expect,
):
  | number
  | string
  | boolean
  | Failover<typeof expect, Expect, Node>[]
  | Failover<typeof expect, Expect, Node>
  | null {
  const result =
    query instanceof XPathExpression
      ? query.evaluate(context, type)
      : xPathEvaluator.evaluate(query, context, undefined, type);

  const { resultType } = result;

  if (type !== resultType) return null;

  if (type === QueryXPathType.ALL) {
    const { snapshotLength } = result;

    const list: Failover<typeof expect, Expect, Node>[] = [];

    for (let index = 0; index < snapshotLength; index += 1) {
      const node = result.snapshotItem(index);
      if (!node) continue;
      if (expect && !(node instanceof expect)) continue;

      list.push(node);
    }

    return list;
  }

  if (type === QueryXPathType.FIRST) {
    const { singleNodeValue } = result;

    if (expect && !(singleNodeValue instanceof expect)) return null;

    return singleNodeValue;
  }

  const key = primitiveResultKeys[type];
  if (!key) return null;

  return result[key];
}
