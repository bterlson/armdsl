import { defineInputParameter, $resourceGroup, concat, repeat2 } from "../src";

import { defineVirtualMachine } from "../src/compute";
import { Value } from "../src/types";

const $acctPrefix = defineInputParameter({
  name: "Account prefix",
  type: "string",
});

const $numDisks = defineInputParameter({
  name: "Number of disks",
  type: "number",
});

declare const $disks: Value<{ lun: number; createOption: "write" }[]>;

const $vm = defineVirtualMachine({
  name: concat($acctPrefix, "-vm"),
  location: $resourceGroup.location,
  properties: {
    storageProfile: {
      dataDisks: repeat2($numDisks, ($i) => ({
        lun: $i,
        createMode: "Write",
      })),
    },
  },
});
