import { parameters, outputs, resources } from "./state";
import { Value, Nodes, isValue, ResourceNode } from "./types";

export function emit() {
  const obj = {
    $schema:
      "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    contentVersion: "1.0.0.0",
    parameters: emitParameters(),
    resources: emitResources(),
    outputs: emitOutputs(),
  };

  console.log(JSON.stringify(obj, null, 4));
}

function emitResources() {
  const res = [];
  for (const resource of resources) {
    res.push(emitResource(resource));
  }
  return res;
}

function emitResource(res: ResourceNode) {
  const obj: any = {};
  if (!res.rest) return obj;
  return emitValue(res.rest);
}

function emitParameters() {
  const params: any = {};

  for (const parameter of parameters) {
    params[parameter.parameter.name] = {
      type: parameter.parameter.type,
      defaultValue: emitValue(parameter.parameter.defaultValue),
      allowedValues: emitValue(parameter.parameter.allowedValues),
      metadata: {
        description: emitValue(parameter.parameter.metadata?.description),
      },
    };
  }

  return params;
}

function emitOutputs() {
  const outs: any = {};

  for (const output of outputs) {
    outs[output.name] = emitValue(output.value);
  }

  return outs;
}

function emitReference(n: Nodes): string {
  switch (n.type) {
    case "value":
      if (n.valueType === "static")
        return JSON.stringify(n.value).replace(/^"|"$/g, "'");
      return emitReference(n.ref!);
    case "memberExpr":
      if (typeof n.rhs === "number") {
        return `${emitReference(n.lhs)}[${n.rhs}]`;
      } else {
        return `${emitReference(n.lhs)}.${n.rhs}`;
      }
    case "callExpression":
      return `${n.target}(${n.args.map((v) => emitReference(v)).join(",")})`;
    case "inputParameter":
      return `parameters('${n.parameter.name}')`;
    default:
      throw new Error("Cannot emit reference to " + n.type);
  }
}

function emitValue(
  value: Value<any> | undefined
): string | number | any[] | undefined {
  if (value && value.type !== "value") throw new Error("Emitting non-value");
  if (value === undefined) return undefined;

  if (value.valueType === "static") {
    if (typeof value.value === "string") return value.value;
    if (typeof value.value === "number") return value.value;

    if (Array.isArray(value.value)) {
      return value.value.map(emitValue);
    }

    let obj: any = {};
    for (let [key, v] of Object.entries(value.value)) {
      obj[key] = emitValue(v as any);
    }
    return obj;
  }

  return `[${emitReference(value.ref!)}]`;
}
