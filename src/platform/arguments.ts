import yargs from "yargs";

type ArgumentSpec = {
  type: "string" | "number";
  defaultValue?: string | number;
  required?: boolean;
  metadata?: {
    description?: string;
  };
};

type ArgumentsSpec = {
  [s: string]: ArgumentSpec;
};

interface TypeNameMap {
  string: string;
  number: number;
}

type ArgV<T extends ArgumentsSpec> = {
  [k in keyof T]: TypeNameMap[T[k]["type"]];
};

/**
 * Define arguments passed to the generator.
 *
 * @param spec an object whose keys are the argument names and whose values describe the expected parameter value.
 */
export function defineArguments<T extends ArgumentsSpec>(spec: T): ArgV<T> {
  for (let [name, argspec] of Object.entries(spec)) {
    yargs.option(name as any, {
      required: argspec.required,
      default: argspec.defaultValue,
      description: argspec.metadata?.description,
    });
  }

  return yargs.argv as any;
}
