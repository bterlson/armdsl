import { Value, BoxValue } from "./types";
import { CallExpressionNode } from "./types";

export function concat(...args: (string | Value<string>)[]): Value<string> {
  return {
    type: "value",
    valueType: "future",
    ref: {
      type: "callExpression",
      target: "concat",
      args: args.map((v) => BoxValue(v)),
    },
  };
}

export function uniquestring(
  ...args: (string | Value<string>)[]
): Value<string> {
  return {
    type: "value",
    valueType: "future",
    ref: {
      type: "callExpression",
      target: "uniqueString",
      args: args.map((v) => BoxValue(v)),
    },
  };
}
