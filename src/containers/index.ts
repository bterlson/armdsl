import { Value, Parameter } from "../types";
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
  name: Parameter<string>;
  location: Parameter<string>;
  dependsOn?: Parameter<string>[];
  properties: {
    restartPolicy: Parameter<string>;
    osType: Parameter<string>;
    containers: Parameter<Container>[];
  };
}

export function defineContainerGroup(options: ContainerOptions) {
  return defineResource({
    name: options.name,
    type: "Microsoft.ContainerInstance/containerGroups",
    apiVersion: "2018-10-01",
    resource: {
      location: options.location,
      propeties: options.properties,
    },
  });
}
