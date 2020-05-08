import {
  Value,
  CallExpressionNode,
  Parameter,
  valueOf,
  ResourceDefinition,
  callValue,
  memberValue,
} from "../types";
import { resources, context } from "../state";
import { and } from ".";

type ResourceOptions = {
  [s: string]: string | number | object | Value<string> | Value<number> | Value<object>;
};

function getResourceIdCall(type: string | Value<string>, name: string | Value<string>) {
  const resourceIdCall: CallExpressionNode = {
    type: "callExpression",
    target: "resourceId",
    args: [type, name],
  };

  return resourceIdCall;
}

export interface DefineResourceOptions {
  name: Parameter<string>;
  type: Parameter<string>;
  apiVersion: string;
  location: Parameter<string>;
  resource?: ResourceOptions;
  condition?: Parameter<boolean>;
  dependsOn?: Value<string[]> | (Value<string> | string)[];
}

export interface Resource {
  name: string;
}

export function defineResource(options: DefineResourceOptions): Value<Resource> {
  const res = applyContext({
    name: options.name,
    type: options.type,
    location: options.location,
    apiVersion: options.apiVersion,
    condition: options.condition,
    dependsOn: options.dependsOn,
    ...options.resource,
  });

  resources.push(res);
  const refValue = reference(resourceId(options.type, options.name), options.apiVersion, "Full");
  refValue.name = memberValue(refValue, "string", "name");
  return refValue;
}

let copiedResourceCount = 0;

function applyContext(res: ResourceDefinition) {
  const conditions = [];
  let copyDef;

  if (res.condition) conditions.push(res.condition);

  for (let c of context) {
    if (c.condition) {
      conditions.push(c.condition);
    }

    if (c.copy) {
      copyDef = {
        name: c.copy.name + copiedResourceCount++,
        count: c.copy.count,
      };

      c.loopNames = [...(c.loopNames ?? []), copyDef.name];
    }
  }

  if (conditions.length === 1) {
    res.condition = conditions[0];
  } else if (conditions.length > 1) {
    res.condition = (and as any)(...conditions);
  }

  if (copyDef) {
    res.copy = copyDef;
  }

  return res;
}

/**
 * Returns the unique identifier of a resource. You use this function when the resource name is
 * ambiguous or not provisioned within the same template. The format of the returned identifier
 * varies based on whether the deployment happens at the scope of a resource group, subscription,
 * management group, or tenant.
 * @param arg1 The first identifier segment
 * @param arg2 The second identifier segment
 * @param args Additional segments
 */
export function resourceId(
  arg1: Parameter<string>,
  arg2: Parameter<string>,
  ...args: Parameter<string>[]
): Value<string> {
  return callValue("resourceId", "string", arg1, arg2, ...args);
}

/**
 * Returns an object representing a resource's runtime state.
 * @param name Name or unique identifier of a resource. When referencing a resource in the current
 * template, provide only the resource name as a parameter. When referencing a
 * previously deployed resource or when the name of the resource is ambiguous, provide
 * the resource ID.
 * @param apiVersion API version of the specified resource. This parameter is required when the
 * resource isn't provisioned within same template. Typically, in the format, yyyy-mm-dd.
 * @param full Value that specifies whether to return the full resource object. If you don't specify
 * 'Full', only the properties object of the resource is returned. The full object includes values
 * such as the resource ID and location.
 */
export function reference<T = any>(
  name: Parameter<string>,
  apiVersion?: string,
  full?: "Full"
): Value<T> {
  return callValue("reference", "any", name, apiVersion, full);
}
