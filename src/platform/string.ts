import { Value, valueOf } from "../types";
import { CallExpressionNode } from "../types";

export function concat(...args: (string | Value<string>)[]): Value<string> {
  const callExpr: CallExpressionNode = {
    type: "callExpression",
    target: "concat",
    args: args,
  };
  return valueOf(callExpr, "string");
}

export function uniquestring(
  ...args: (string | Value<string>)[]
): Value<string> {
  const callExpr: CallExpressionNode = {
    type: "callExpression",
    target: "uniquestring",
    args: args,
  };
  return valueOf(callExpr, "string");
}
