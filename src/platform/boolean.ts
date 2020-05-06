import { Parameter, Value, callValue } from "../types";

/**
 * Returns first non-null value from the parameters. Empty strings, empty arrays, and
 * empty objects are not null.
 * @param arg1 The first value to test for null.
 * @param args Additional values to test for null.
 */

export function coalesce(arg1: Parameter<any>, ...args: Parameter<any>[]): Value<boolean> {
  return callValue("coalesce", "boolean", arg1, ...args);
}

/**
 * Checks whether two values equal each other.
 * @param arg1 The first value to check for equality.
 * @param arg2 The second value to check for equality.
 */
export function equals(arg1: Parameter<any>, arg2: Parameter<any>): Value<boolean> {
  return callValue("equals", "boolean", arg1, arg2);
}

/**
 * Checks whether the first value is greater than the second value.
 * @param arg1 The first value for the greater comparison.
 * @param arg2 The second value for the greater comparison.
 */
export function greater(
  arg1: Parameter<number> | Parameter<string>,
  arg2: Parameter<number> | Parameter<string>
) {
  return callValue("greater", "boolean", arg1, arg2);
}

/**
 * Checks whether the first value is greater than or equal to the second value.
 * @param arg1 The first value for the greater or equals comparison.
 * @param arg2 The second value for the greater or equals comparison.
 */
export function greaterOrEquals(
  arg1: Parameter<number> | Parameter<string>,
  arg2: Parameter<number> | Parameter<string>
) {
  return callValue("greaterOrEquals", "boolean", arg1, arg2);
}

/**
 * Checks whether the first value is less than the second value.
 * @param arg1 The first value for the less comparison.
 * @param arg2 The second value for the less comparison.
 */
export function less(
  arg1: Parameter<number> | Parameter<string>,
  arg2: Parameter<number> | Parameter<string>
) {
  return callValue("less", "boolean", arg1, arg2);
}

/**
 * Checks whether the first value is less than or equal to the second value.
 * @param arg1 The first value for the less or equals comparison.
 * @param arg2 The second value for the less or equals comparison.
 */
export function lessOrEquals(
  arg1: Parameter<number> | Parameter<string>,
  arg2: Parameter<number> | Parameter<string>
) {
  return callValue("lessOrEquals", "boolean", arg1, arg2);
}
