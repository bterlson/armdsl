import { Value, CallExpressionNode, Parameter, valueOf } from "../types";
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
    args: [type, name],
  };

  return resourceIdCall;
}

interface DefineResourceOptions {
  name: Parameter<string>;
  type: Parameter<string>;
  apiVersion: string;
  resource: ResourceOptions;
}

export interface Resource {
  name: string;
}
export function defineResource(
  options: DefineResourceOptions
): Value<Resource> {
  const res = {
    name: options.name,
    type: options.type,
    apiVersion: options.apiVersion,
    ...options.resource,
  };
  resources.push(res);

  return valueOf(getResourceIdCall(options.type, options.name), {
    name: "string",
  });
}
