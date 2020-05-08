import { defineInputParameter, greater } from "../src";
import { defineStorageAccount } from "../src/storage";

const $accountNames = defineInputParameter({
  name: "Account names (up to two)",
  type: "array",
  defaultValue: [],
});

defineStorageAccount({
  name: "acct1",
  sku: "Premium_LRS",
  location: "uswest",
  condition: greater($accountNames.length, 0),
});

defineStorageAccount({
  name: "acct2",
  sku: "Premium_LRS",
  location: "uswest",
  condition: greater($accountNames.length, 1),
});
