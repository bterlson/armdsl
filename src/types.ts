type KnownProps<T> = T extends object
  ? {
      [k in keyof T]: T[k];
    }
  : {};

export type Value<T> = {
  type: "value";
  value?: T;
  ref?: Nodes;
  valueType: "future" | "static";
} & KnownProps<T>;

export function isValue(v: unknown): v is Value<any> {
  if (typeof v !== "object") return false;
  if (v === null) return false;
  if ("type" in v) {
    return (v as any).type === "value";
  }
  return false;
}

export function BoxValue(v: string | Value<string>): Value<string>;
export function BoxValue(v: number | Value<number>): Value<number>;
export function BoxValue<T extends object>(v: T): Value<T>;
export function BoxValue<T extends any[]>(v: T): Value<T>;
export function BoxValue<T>(
  v: string | number | string[] | number[] | object | Value<any>
): Value<any> {
  if (isValue(v)) return v;

  if (typeof v === "string" || typeof v === "number") {
    return {
      type: "value",
      value: v,
      valueType: "static",
    };
  }

  if (Array.isArray(v)) {
    return {
      type: "value",
      valueType: "static",
      value: (v as any).map(BoxValue),
    };
  } else {
    console.error("Got object", v);
    throw new Error("No object boxing yet");
  }
}

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
    defaultValue?: Value<string> | Value<number>;
    allowedValues?: Value<(string | number)[]>;
    metadata?: {
      description?: Value<string>;
    };
  };
}

export interface CallExpressionNode {
  type: "callExpression";
  target: string;
  args: Value<any>[];
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

type PrimitiveDataTypes = number | string | boolean;
