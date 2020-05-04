import { Value, BoxValue, CallExpressionNode, Parameter } from "../types";
import { resources } from "../state";

type ResourceOptions = {
  [s: string]:
    | string
    | number
    | object
    | Value<string>
    | Value<number>
    | Value<object>;
};

function getResourceIdCall(
  type: string | Value<string>,
  name: string | Value<string>
) {
  const resourceIdCall: CallExpressionNode = {
    type: "callExpression",
    target: "resourceId",
    args: [BoxValue(type), BoxValue(name)],
  };

  return resourceIdCall;
}

interface DefineResourceOptions {
  name: Parameter<string>;
  type: Parameter<string>;
  apiVersion: string;
  resource: ResourceOptions;
}

export function defineResource(options: DefineResourceOptions): Value<string> {
  const res = {
    name: options.name,
    type: options.type,
    apiVersion: options.apiVersion,
    ...options.resource,
  };
  resources.push({
    type: "resource",
    rest: BoxValue(res),
  });

  return {
    type: "value",
    valueType: "future",
    ref: getResourceIdCall(options.type, options.name),
  };
}
