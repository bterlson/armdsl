import { Value } from "../types";
import { defineResource } from "../platform";

interface Container {
  name: string;
  properties: {
    image: string;
    command?: (string | Value<string>)[]; // hack
    environmentVariables: { [s: string]: string | Value<string> }; // hack
    resources: {
      requests: {
        cpu: string;
        memoryInGb: string;
      };
    };
  };
}

interface ContainerOptions {
  dependsOn: (string | Value<string>)[];
  properties: {
    restartPolicy: string | Value<string>;
    osType: string | Value<string>;
    containers: (Container | Value<Container>)[];
  };
}

/**
 * Define a container group
 *
 * @param name The name of the container group
 * @param location The location to deploy the container group to
 * @param options Additional options
 */
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
