import { test } from "mocha";

export type Value<T> = 0 extends 1 & T
  ? any
  : MakePrimitiveValue<Exclude<T, object | undefined>> | MakeStructuredValue<Extract<T, object>>;

type MakePrimitiveValue<T> = [T] extends [never] ? never : PrimitiveValue<T>;

type MakeStructuredValue<T extends object> = object extends Required<T>
  ? Record<string, any>
  : T extends any[]
  ? ArrayValue<T[number]>
  : ObjectValue<T>;

type BaseValue = { " value": Nodes };

type PrimitiveValue<T> = BaseValue & { " type": TypeToName<T> };

type ArrayValue<T> = BaseValue & {
  readonly length: number;
  " type": "array";
} & {
    readonly [K in number]: Value<T>;
  };

type ObjectValue<T> = BaseValue & { " type": "object" } & {
    readonly [K in keyof T]-?: Value<T[K]>;
  };

export type Parameter<T> =
  | MakePrimitiveParameter<Exclude<T, object | undefined>>
  | MakeStructuredParameter<Extract<T, object>>
  | Extract<T, undefined>;

type MakePrimitiveParameter<T> = [T] extends [never] ? never : Value<T> | T;

type MakeStructuredParameter<T> = object extends Required<T>
  ? Record<string, any>
  : T extends any[]
  ? ArrayParameter<T[number]>
  : ObjectParameter<T>;

type ArrayParameter<T> = {
  [K in number]: Parameter<T>;
};

type ObjectParameter<T> = {
  [K in keyof T]: Parameter<T[K]>;
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
  array: any[];
  object: object;
  any: any;
};

type TypeNames = keyof NameToType;

export type ObjectValueDescriptor = {
  [s: string]: ValueDescriptor;
};

export type ArrayValueDescriptor = [ValueDescriptor];

export type ValueDescriptor = keyof NameToType | ObjectValueDescriptor | ArrayValueDescriptor;

type TypeFromObjectDescriptor<T extends {}> = {
  [k in keyof T]: TypeFromDescriptor<T[k]>;
};

export type TypeFromDescriptor<T> = T extends [any]
  ? Array<TypeFromDescriptor<T[0]>>
  : T extends object
  ? TypeFromObjectDescriptor<T>
  : T extends TypeNames
  ? NameToType[T]
  : never;

export function valueOf(value: Nodes, type: "string"): Value<string>;
export function valueOf(value: Nodes, type: "number"): Value<number>;
export function valueOf(value: Nodes, type: "boolean"): Value<boolean>;
export function valueOf(value: Nodes, type: "object"): Value<object>;
export function valueOf(value: Nodes, type: "array"): Value<any[]>;
export function valueOf<T extends ObjectValueDescriptor>(
  value: Nodes,
  type: T
): Value<TypeFromDescriptor<T>>;
export function valueOf<T extends ArrayValueDescriptor>(
  value: Nodes,
  type: T
): Value<TypeFromDescriptor<T>>;
export function valueOf(value: Nodes, type: "any"): Value<any>;
export function valueOf<T>(value: Nodes, type: T): Value<TypeFromDescriptor<T>>;
export function valueOf(
  value: Nodes,
  type: ValueDescriptor
): PrimitiveValue<string | number | boolean> | ObjectValue<any> | ArrayValue<any> {
  if (type === "object" || type === "any") {
    // AnyObject
    return createAnyObjectProxy(value);
  } else if (type === "array") {
    // AnyArray
    return createArrayProxy(value);
  } else if (Array.isArray(type)) {
    // Typed array
    return createArrayProxy(
      value,
      (memberExpr) => valueOf(memberExpr, type[0] as any) // ?
    );
  } else if (type !== null && typeof type === "object") {
    const obj: Value<TypeFromDescriptor<typeof type>> = {
      " value": value,
    };

    for (let [key, descriptor] of Object.entries(type)) {
      const memberExpr: MemberExpressionNode = {
        type: "memberExpr",
        lhs: value,
        rhs: key,
      };
      obj[key] = valueOf(memberExpr, descriptor as any); // ?
    }

    return obj as any; // ?
  } else if (type === "boolean" || type === "string" || type === "number") {
    // primitive type
    return {
      " type": type,
      " value": value,
    };
  }
  throw new Error("Unknown type descriptor " + JSON.stringify(type));
}

function createAnyObjectProxy(base: Nodes): ObjectValue<any> {
  return new Proxy(
    { " value": base },
    {
      get(target, prop, receiver) {
        // todo: handle symbols
        const indexMemberExpr: MemberExpressionNode = {
          type: "memberExpr",
          lhs: base,
          rhs: prop as string,
        };

        if (prop in target) {
          return Reflect.get(target, prop, receiver);
        } else {
          return valueOf(indexMemberExpr, "any");
        }
      },
    }
  ) as any;
}

function createArrayProxy(
  base: Nodes,
  elementFactory?: (baseNode: Nodes) => Value<any>
): ArrayValue<any> {
  return new Proxy(
    {
      " value": base,
      length: valueOf({ type: "memberExpr", lhs: base, rhs: "length" }, "number"),
    },
    {
      get(target, prop, receiver) {
        // todo: when is `prop` typeof number?
        if (typeof prop === "string" && Number.isInteger(parseFloat(prop))) {
          const indexMemberExpr: MemberExpressionNode = {
            type: "memberExpr",
            lhs: base,
            rhs: String(parseInt(prop)),
          };

          if (elementFactory) {
            return elementFactory(indexMemberExpr);
          } else {
            return valueOf(indexMemberExpr, "any");
          }
        } else {
          return Reflect.get(target, prop, receiver);
        }
      },
    }
  ) as any;
}
export function isValue(v: unknown): v is Value<any> {
  return typeof v === "object" && v !== null && v.hasOwnProperty(" value");
}
export type PrimitiveTypes = string | number | boolean;
export type ComplexTypes = object | any[];
export type AllTypes = ComplexTypes | PrimitiveTypes;

export interface MemberExpressionNode {
  type: "memberExpr";
  lhs: Nodes;
  rhs: string;
}

export function memberValue(
  base: Value<object>,
  type: ValueDescriptor,
  arg1: string,
  ...args: string[]
): MemberExpressionNode {
  let current = {
    type: "memberExpr",
    lhs: base[" value"],
    rhs: arg1,
  } as const;

  for (let arg of args) {
    current = {
      type: "memberExpr",
      lhs: current,
      rhs: arg,
    };
  }

  return valueOf(current, type);
}
export interface IdentifierNode {
  type: "identifier";
  name: string;
}

export interface CallExpressionNode {
  type: "callExpression";
  target: string;
  args: Parameter<any>[];
}

export function callValue<T extends ValueDescriptor>(
  fn: string,
  type: T,
  ...args: Value<any>[]
): Value<TypeFromDescriptor<T>> {
  const expr: CallExpressionNode = {
    type: "callExpression",
    target: fn,
    args: args,
  };

  return valueOf(expr, type);
}

export type Nodes = MemberExpressionNode | CallExpressionNode | IdentifierNode;

export interface InputParameterDefinition {
  type: string;
  defaultValue?:
    | Parameter<string>
    | Parameter<number>
    | Parameter<boolean>
    | Parameter<object>
    | Parameter<any[]>;
  allowedValues?: Value<(string | number)[]> | (string | number)[];
  metadata?: {
    description: Value<string> | string;
  };
}

interface CopyDefinition {
  name: string;
  count: Value<number>;
}
export interface ResourceDefinition {
  name: Parameter<string>;
  type: Parameter<string>;
  location: Parameter<string>;
  apiVersion: string;
  condition?: Parameter<boolean>;
  copy?: CopyDefinition;
  dependsOn?: Value<string[]> | (Value<string> | string)[];
  properties?: {
    [s: string]: any;
  };
}

export interface OutputParameterDefinition {
  type: string;
  value: Parameter<any>;
}
