import { parameters, outputs } from "../state";
import {
  Value,
  InputParameterNode,
  BoxValue,
  CallExpressionNode,
  MemberExpressionNode,
} from "../types";

type DefineInputParameterOptions<T> = {
  name: string;
  type: T;
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

type ParameterTypes = "string" | "number" | "boolean" | "object" | "array";

/**
 * Define a template parameter
 *
 * @param name The name of the parameter
 * @param type The type of the parameter
 * @param options Additional options
 */
export function defineInputParameter<T extends ParameterTypes>(
  options: DefineInputParameterOptions<T>
): Value<TypeMap[T]> {
  const parameter: InputParameterNode = {
    type: "inputParameter",
    parameter: {
      name: options.name,
      type: options.type,
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

  parameters.push(parameter);

  // TODO: fix me
  return value as any;
}

interface OutputParameterOptions {
  name: string;
  value: Value<any>;
}

export function defineOutputParameter(options: OutputParameterOptions) {
  outputs.push({
    type: "output",
    name: options.name,
    value: options.value,
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

type DefineLocationParameterOptions = Omit<
  DefineInputParameterOptions<"string">,
  "type"
>;

const defaultLocationOptions = {
  type: "string" as const,
  defaultValue: $resourceGroup.id,
  metadata: {
    description: "Location for all resources.",
  },
};

export function defineLocationParameter(
  options: DefineLocationParameterOptions
) {
  const opts = { ...defaultLocationOptions, ...options };
  return defineInputParameter(opts);
}
