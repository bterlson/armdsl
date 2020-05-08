import { parameters, outputs, context } from "../state";
import {
  Value,
  CallExpressionNode,
  MemberExpressionNode,
  valueOf,
  Parameter,
  InputParameterDefinition,
  isValue,
} from "../types";
import { and } from ".";

type DefineInputParameterOptions<T> = {
  name: string;
  type: T;
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
};

interface TypeMap {
  string: string;
  number: number;
  boolean: boolean;
  object: object;
  array: Array<any>;
}

type ParameterTypes = "string" | "number" | "boolean" | "object" | "array";

interface OutputDefinition {
  type: ParameterTypes;
  condition?: Value<boolean>;
  value?: Value<any>;
  copy?: {
    count: Value<number>;
    input: Value<any>;
  };
}

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
  const parameter: InputParameterDefinition = {
    type: options.type,
    allowedValues: options.allowedValues,
    metadata: options.metadata,
    defaultValue: options.defaultValue,
  };

  const callExpr: CallExpressionNode = {
    type: "callExpression",
    args: [options.name],
    target: "parameter",
  };

  const value: Value<any> = valueOf(callExpr, options.type);

  parameters[options.name] = parameter;

  return value as any;
}

interface OutputParameterOptions {
  name: string;
  value: Value<any>;
}

export function defineOutputParameter(options: OutputParameterOptions) {
  outputs[options.name] = applyContext({
    type: isValue(options.value) ? options.value[" type"] : typeof options.value,
    value: options.value,
  }) as any;
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

export const $resourceGroup: Value<ResourceGroup> = valueOf(resourceGroupCall, {
  id: "string",
  location: "string",
});

type DefineLocationParameterOptions = Omit<DefineInputParameterOptions<"string">, "type">;

const defaultLocationOptions = {
  type: "string" as const,
  defaultValue: $resourceGroup.id,
  metadata: {
    description: "Location for all resources.",
  },
};

export function defineLocationParameter(options: DefineLocationParameterOptions) {
  const opts = { ...defaultLocationOptions, ...options };
  return defineInputParameter(opts);
}

function applyContext(res: OutputDefinition) {
  const conditions = [];
  let copyDef;

  if (res.condition) conditions.push(res.condition);

  for (let c of context) {
    if (c.condition) {
      conditions.push(c.condition);
    }

    if (c.copy) {
      copyDef = {
        count: c.copy.count,
        input: res.value,
      };
    }
  }

  if (conditions.length === 1) {
    res.condition = conditions[0];
  } else if (conditions.length > 1) {
    res.condition = (and as any)(...conditions);
  }

  if (copyDef) {
    delete res.value;
    res.copy = copyDef;
    res.type = "array";
  }

  return res;
}
