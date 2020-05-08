import { Value, Parameter, callValue } from "../types";
import { context } from "../state";
import { not } from ".";

/**
 *
 *
 * @param $test The value to test
 * @param ifTrue What to do when the test is true
 */
export function when($test: Value<boolean>, ifTrue: () => void): void;
export function when($test: Value<boolean>, options: { do: () => void; else?: () => void }): void;
export function when(
  $test: Value<boolean>,
  options: { do: () => void; else?: () => void } | (() => void)
) {
  if (typeof options === "function") {
    options = { do: options };
  }
  context.push({ condition: $test });
  options.do();
  context.pop();

  if (options.else) {
    const $inverse = not($test);
    context.push({ condition: $inverse });
    options.else();
    context.pop();
  }
}

let copyLoopCount = 0;

export function repeat($end: Parameter<number>, body: ($index: Value<number>) => void): string[] {
  context.push({
    copy: {
      name: `loop${copyLoopCount++}`,
      count: $end,
    },
  });

  const $index = callValue("copyIndex", "number");

  body($index);

  const ctx = context.pop();

  return ctx.loopNames;
}

export function repeat2<T>(
  $end: Parameter<number>,
  body: ($index: Value<number>) => Parameter<T>
): Value<T[]> {
  return {} as any;
}
