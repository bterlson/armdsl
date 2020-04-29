// https://github.com/Azure/azure-quickstart-templates/blob/master/101-aci-storage-file-share/azuredeploy.json

import {
  uniquestring,
  defineInputParameter,
  $resourceGroup,
  defineArguments,
  defineLocationParameter,
} from "../src";

import {
  defineAccountTypeParameter,
  defineStorageAccount,
} from "../src/storage";

import { defineContainerGroup } from "../src/containers";

// arguments are passed via command line
const args = defineArguments({
  image: {
    type: "string",
    defaultValue: "microsoft/azure-cli",
  },
  cpuCores: {
    type: "string",
    defaultValue: "1.0",
  },
  memoryInGb: {
    type: "string",
    defaultValue: "1.5",
  },
});

// parameter values are provided at deployment time
const $name = defineInputParameter("Storage Account Name", "string", {
  defaultValue: uniquestring($resourceGroup.id),
});
const $fsName = defineInputParameter("File Share Name", "string");
const $storageType = defineAccountTypeParameter("Storage Account Type");
const $location = defineInputParameter("location", "string", {
  defaultValue: $resourceGroup.location,
  metadata: {
    description: "The location of all resources",
  },
});

const $containerInstanceLocation = defineInputParameter(
  "Container Instance Location",
  "string",
  {
    defaultValue: $location,
    allowedValues: [
      "westus",
      "eastus",
      "westeurope",
      "southeastaisa",
      "westus2",
    ],
  }
);
const $storageAccount = defineStorageAccount($name, $location, $storageType);

defineContainerGroup("createshare-containerinstance", $location, {
  dependsOn: [$storageAccount],
  properties: {
    restartPolicy: "OnFailure",
    osType: "linux",
    containers: [
      {
        name: "createshare",
        properties: {
          image: "microsoft/azure-cli",
          command: ["az", "storage", "share", "create", "--name", $fsName],
          environmentVariables: {
            AZURE_STORAGE_ACCOUNT: $name,
            AZURE_STORAGE_KEY: $storageAccount.keys[0].value,
          },
          resources: {
            requests: {
              cpu: args.cpuCores,
              memoryInGb: args.memoryInGb,
            },
          },
        },
      },
    ],
  },
});
