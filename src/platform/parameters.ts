import { parameters, outputs } from "../state";
import {
  Value,
  InputParameterNode,
  BoxValue,
  CallExpressionNode,
  MemberExpressionNode,
} from "../types";

type DefineInputParameterOptions = {
  defaultValue?: Value<string> | Value<number> | string | number;
  allowedValues?: Value<(string | number)[]> | (string | number)[];
  metadata?: {
    description: Value<string> | string;
  };
};

interface TypeMap {
  string: string;
  number: number;
  boolean: boolean;
  object: object;
  array: Array<any>;
}

export function defineInputParameter<
  T extends "string" | "number" | "boolean" | "object" | "array"
>(
  name: string,
  type: T,
  options: DefineInputParameterOptions = {}
): Value<TypeMap[T]> {
  const parameter: InputParameterNode = {
    type: "inputParameter",
    parameter: {
      name,
      type: typeof type,
      allowedValues: options.allowedValues
        ? (BoxValue(options.allowedValues) as Value<(string | number)[]>)
        : undefined,
      metadata: {
        description: options.metadata?.description
          ? BoxValue(options.metadata?.description)
          : undefined,
      },
      defaultValue: options.defaultValue
        ? BoxValue(options.defaultValue as any)
        : undefined,
    },
  };

  const value: Value<any> = {
    valueType: "future",
    type: "value",
    ref: parameter,
  };

  const param = {
    type,
  };

  parameters.push(parameter);

  // TODO: fix me
  return value as any;
}

export function defineOutputParameter<T>(name: string, value: Value<T>) {
  outputs.push({
    type: "output",
    name,
    value,
  });
}

interface ResourceGroup {
  id: string;
  location: string;
}

const resourceGroupCall: CallExpressionNode = {
  type: "callExpression",
  target: "resourceGroup",
  args: [],
};

const resourceGroupId: MemberExpressionNode = {
  type: "memberExpr",
  lhs: resourceGroupCall,
  rhs: "id",
};

const resourceGroupLocation: MemberExpressionNode = {
  type: "memberExpr",
  lhs: resourceGroupCall,
  rhs: "location",
};

export const $resourceGroup: Value<ResourceGroup> = {
  type: "value",
  ref: resourceGroupCall,
  valueType: "future",
  id: {
    type: "value",
    valueType: "future",
    ref: resourceGroupId,
  },
  location: {
    type: "value",
    valueType: "future",
    ref: resourceGroupLocation,
  },
};

const defaultLocationOptions: DefineInputParameterOptions = {
  defaultValue: $resourceGroup.id,
  metadata: {
    description: "Location for all resources.",
  },
};

export function defineLocationParameter(
  name: string,
  options?: DefineInputParameterOptions
) {
  const opts = { ...defaultLocationOptions, ...options };
  return defineInputParameter(name, "string", opts);
}
