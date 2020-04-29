import yargs from "yargs";

type ArgumentSpec = {
  type: "string" | "number";
  defaultValue?: string | number;
  required?: boolean;
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

export function defineArguments<T extends ArgumentsSpec>(spec: T): ArgV<T> {
  for (let [name, argspec] of Object.entries(spec)) {
    yargs.option(name as any, {
      required: argspec.required,
      default: argspec.defaultValue,
    });
  }

  return yargs.argv as any;
}
