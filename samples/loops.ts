import {
  defineInputParameter,
  repeat,
  $resourceGroup,
  concat,
  defineOutputParameter,
} from "../src";
import { defineStorageAccount } from "../src/storage";
import { defineContainerGroup } from "../src/containers";

const $acctPrefix = defineInputParameter({
  name: "Account prefix",
  type: "string",
});

const $numAccounts = defineInputParameter({
  name: "Number of accounts",
  type: "number",
});

const vms = repeat($numAccounts, ($i) => {
  let $acct = defineStorageAccount({
    name: concat($acctPrefix, "-storage-", $i),
    location: $resourceGroup.location,
    sku: "Premium_LRS",
  });

  defineContainerGroup({
    name: concat("container-", $i),
    location: $resourceGroup.location,
    dependsOn: [$acct.name],
    properties: {
      osType: "Linux",
      restartPolicy: "OnError",
      containers: [
        {
          name: "sharecontainer",
          properties: {
            image: "microsoft/azure-cli",
            environmentVariables: {
              AZURE_STORAGE_ACCOUNT: $acct.name,
              AZURE_STORAGE_KEY: $acct.keys[0].value,
            },
            resources: {
              requests: {
                cpu: "1",
                memoryInGb: "1.5",
              },
            },
          },
        },
      ],
    },
  });

  defineOutputParameter({
    name: "storageEndpoints",
    value: $acct.primaryEndpoints.blob,
  });
});

defineStorageAccount({
  name: "main-storage",
  location: $resourceGroup.location,
  sku: "Standard_LRS",
  dependsOn: vms,
});
