import { Value, BoxValue, CallExpressionNode } from "../types";
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

export function defineResource(
  name: string | Value<string>,
  type: string | Value<string>,
  apiVersion: string,
  resource: ResourceOptions
): Value<string> {
  const res = {
    name,
    type,
    apiVersion,
    ...resource,
  };
  resources.push({
    type: "resource",
    rest: BoxValue(res),
  });

  return {
    type: "value",
    valueType: "future",
    ref: getResourceIdCall(type, name),
  };
}
