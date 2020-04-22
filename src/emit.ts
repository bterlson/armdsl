import { parameters, outputs, resources } from "./state";
import { Value, Nodes, isValue } from "./types";

export function emit() {
  console.log("Emitting template, input graph:", {
    parameters,
    resources,
    outputs,
  });

  const obj = {
    $schema:
      "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    contentVersion: "1.0.0.0",
    parameters: emitParameters(),
    resources: emitResources(),
    outputs: emitOutputs(),
  };

  return JSON.stringify(obj, null, 4);
}

function emitResources() {
  const res = [];
  for (const resource of resources) {
    res.push(emitValue(resource.rest));
  }
  return res;
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
      return `${emitReference(n.lhs)}.${n.rhs}`;
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
  if (value === undefined) return undefined;

  if (value.valueType === "static") {
    if (typeof value.value === "string") return value.value;
    if (typeof value.value === "number") return value.value;

    if (Array.isArray(value.value)) {
      return value.value.map(emitValue);
    }

    throw "fail";
  }

  return `[${emitReference(value.ref!)}]`;
}
