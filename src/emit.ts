import { parameters, outputs, resources } from "./state";
import { Value, Nodes, isValue } from "./types";

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
  return emitGraphNode(resources);
}

function emitParameters() {
  return emitGraphNode(parameters);
}

function emitOutputs() {
  return emitGraphNode(outputs);
}

function emitReference(n: Nodes | string | number | boolean): string {
  if (n != undefined && typeof n === "object") {
    switch (n.type) {
      case "memberExpr":
        if (typeof n.rhs === "number" || n.rhs.match(/^\d+$/)) {
          return `${emitReference(n.lhs)}[${n.rhs}]`;
        } else {
          return `${emitReference(n.lhs)}.${n.rhs}`;
        }
      case "callExpression":
        return `${n.target}(${n.args.map((v) => emitValue(v)).join(",")})`;
      case "identifier":
        return n.name;
    }
  } else {
    return JSON.stringify(n);
  }
}

export function emitValue(
  value: Value<any> | string | number | boolean
): string {
  if (isValue(value)) {
    return emitReference(value[" value"]);
  } else if (typeof value === "string") {
    return `'${value}'`;
  } else {
    return JSON.stringify(value);
  }
}

export function emitGraphNode(
  value: Value<any> | string | number | boolean | object | any[]
): string | object {
  if (isValue(value)) {
    return `[${emitReference(value[" value"])}]`;
  } else if (typeof value === "object" && value !== null) {
    let obj: any;

    if (Array.isArray(value)) {
      obj = [];
    } else {
      obj = {};
    }

    for (let [key, v] of Object.entries(value)) {
      obj[key] = emitGraphNode(v);
    }

    return obj;
  } else {
    return value;
  }
}
