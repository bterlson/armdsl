type ObjectValue<T extends object> = {
  [k in keyof T]: Value<T[k]>;
};

type ArrayValue<T> = {
  length: Value<number>;
  [n: number]: Value<T>;
};

type AnyObjectValue = {
  [s: string]: Value<any>;
};

type PrimitiveValue<T> = {
  // this is never set, but needs to be present to
  // prevent this type from being simplified away
  " primitiveType"?: T;
};

type TypeToName<T> = T extends string
  ? "string"
  : T extends number
  ? "number"
  : T extends boolean
  ? "boolean"
  : T extends []
  ? "array"
  : T extends object
  ? "object"
  : never;

type NameToType = {
  string: string;
  number: number;
  boolean: boolean;
  object: object;
  array: [];
};

interface BaseValue<T> {
  " value": Nodes;
  " type": T;
}

type IsAny<T> = 0 extends 1 & T ? true : false;

export type Value<T> = BaseValue<T> &
  (IsAny<T> extends true
    ? AnyObjectValue
    : T extends Array<infer U>
    ? ArrayValue<U>
    : T extends number | boolean | string
    ? PrimitiveValue<T>
    : T extends object
    ? object extends T
      ? AnyObjectValue
      : ObjectValue<T>
    : { fail: true });

export type Parameter<T> = T | Value<T>;

export function valueOf(value: Nodes, type: "string"): Value<string>;
export function valueOf(value: Nodes, type: "number"): Value<number>;
export function valueOf(value: Nodes, type: "boolean"): Value<boolean>;
export function valueOf(value: Nodes, type: "object"): Value<object>;
export function valueOf<T extends object>(
  value: Nodes,
  type: "object",
  knownProps: T
): Value<T>;
export function valueOf<T extends object>(
  value: Nodes,
  type: "string" | "number" | "boolean" | "object" | "array",
  knownProps?: T
):
  | PrimitiveValue<string | number | boolean>
  | ObjectValue<object>
  | ObjectValue<T> {
  return {
    " type": type,
    " value": value,
  } as any;
}

export type PrimitiveTypes = string | number | boolean;
export type ComplexTypes = object | any[];
export type test = any[] extends {} ? true : false;
export type AllTypes = ComplexTypes | PrimitiveTypes;

export interface OutputNode {
  type: "output";
  name: string;
  value: Value<any>;
}

export interface ReferenceNode {
  type: "reference";
  reference: {
    name: Value<string>;
    type: Value<string>;
    location: Value<string>;
    rest: object;
  };
}

export interface MemberExpressionNode {
  type: "memberExpr";
  lhs: Nodes;
  rhs: string;
}

export interface InputParameterNode {
  type: "inputParameter";
  parameter: {
    name: string;
    type: string;
    defaultValue?: Parameter<string> | Parameter<number>;
    allowedValues?: Parameter<(string | number)[]>;
    metadata?: {
      description?: Parameter<string>;
    };
  };
}

export interface CallExpressionNode {
  type: "callExpression";
  target: string;
  args: Parameter<any>[];
}

export interface ResourceNode {
  type: "resource";
  rest: any;
}

export type Nodes =
  | MemberExpressionNode
  | InputParameterNode
  | CallExpressionNode
  | ResourceNode
  | Value<string | number>;
