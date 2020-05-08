import {
  defineInputParameter,
  greater,
  when,
  equals,
  repeat,
  concat,
  $resourceGroup,
} from "../src";
import { defineStorageAccount } from "../src/storage";

const $numAccounts = defineInputParameter({
  name: "Number of accounts",
  type: "number",
  defaultValue: 1,
});

repeat($numAccounts, ($i) => {
  when(equals($i, 1), () => {
    // first account is premium
    defineStorageAccount({
      name: concat("storage-", $i),
      location: $resourceGroup.location,
      sku: "Premium_LRS",
    });
  });

  when(greater($i, 1), () => {
    // rest are standard
    defineStorageAccount({
      name: concat("storage-", $i),
      location: $resourceGroup.location,
      sku: "Standard_LRS",
    });
  });
});
