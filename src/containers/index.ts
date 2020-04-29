import { Value } from "../types";
import { defineResource } from "../platform";

interface ContainerOptions {
  dependsOn: (string | Value<string>)[];
  properties: {
    restartPolicy: string | Value<string>;
    osType: string | Value<string>;
    containers: any[];
  };
}
export function defineContainerGroup(
  name: string | Value<string>,
  location: string | Value<string>,
  options: ContainerOptions
) {
  return defineResource(
    name,
    "Microsoft.ContainerInstance/containerGroups",
    "2018-10-01",
    {
      location,
      ...options,
    }
  );
}
