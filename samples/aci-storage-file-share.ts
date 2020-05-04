// https://github.com/Azure/azure-quickstart-templates/blob/master/101-aci-storage-file-share/azuredeploy.json

import { uniquestring, defineInputParameter, $resourceGroup } from "../src";

import {
  defineAccountTypeParameter,
  defineStorageAccount,
} from "../src/storage";

import { defineContainerGroup } from "../src/containers";

const args = {
  image: "microsoft/azure-cli",
  cpuCores: "1.0",
  memoryInGb: "1.5",
};

const $name = defineInputParameter({
  name: "Storage Account Name",
  type: "string",
  defaultValue: uniquestring($resourceGroup.id),
});

const $fsName = defineInputParameter({
  name: "File Share Name",
  type: "string",
});

const $storageType = defineAccountTypeParameter({
  name: "Storage Account Type",
});

const $location = defineInputParameter({
  name: "location",
  type: "string",
  defaultValue: $resourceGroup.location,
  metadata: {
    description: "The location of all resources",
  },
});

const $containerInstanceLocation = defineInputParameter({
  name: "Container Instance Location",
  type: "string",
  defaultValue: $location,
  allowedValues: ["westus", "eastus", "westeurope", "southeastaisa", "westus2"],
});

const $storageAccount = defineStorageAccount({
  name: $name,
  location: $location,
  sku: $storageType,
});

defineContainerGroup({
  name: "createshare-containerinstance",
  location: $containerInstanceLocation,
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
