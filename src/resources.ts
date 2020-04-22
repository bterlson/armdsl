import { Value } from "./types";
import { resources } from "./state";

type ResourceOptions = {
  type: string | Value<string>;
  apiVersion: string | Value<string>;
} & {
  [s: string]:
    | string
    | number
    | object
    | Value<string>
    | Value<number>
    | Value<object>;
};

export function defineResource(
  name: string | Value<string>,
  resource: ResourceOptions
): void {
  resources.push({
    type: "resource",
    rest: resource,
  });
}
