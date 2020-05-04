import {
  defineArguments,
  $resourceGroup,
  defineInputParameter,
  concat,
} from "../src";
import { defineStorageAccount } from "../src/storage";
import { defineContainerGroup } from "../src/containers";

const args = defineArguments({
  numShares: {
    type: "number",
    defaultValue: 2,
    metadata: {
      description: "The number of file shares to create",
    },
  },
});

const $acctPrefix = defineInputParameter(
  "Storage Account Name Prefix",
  "string"
);

for (let i = 0; i < args.numShares; i++) {
  let $acct = defineStorageAccount(
    concat($acctPrefix, "storage-" + i),
    $resourceGroup.location,
    ""
  );

  defineContainerGroup("container-" + i, $resourceGroup.location, {
    dependsOn: [$acct],
    properties: {
      osType: "Linux",
      restartPolicy: "OnError",
      containers: [
        {
          name: "sharecontainer",
          properties: {
            image: "microsoft/azure-cli",
            environmentVariables: {
              AZURE_STORAGE_ACCOUNT: "storage-" + i,
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
}
