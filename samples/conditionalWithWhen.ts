import { defineInputParameter, greater, when, equals } from "../src";
import { defineStorageAccount } from "../src/storage";

const $accountNames = defineInputParameter({
  name: "Account names (up to two)",
  type: "array",
  defaultValue: [],
});

const $usePremium = defineInputParameter({
  name: "Use premium accounts?",
  type: "boolean",
});

when(equals($accountNames.length, 1), {
  do() {
    when($usePremium, {
      do() {
        defineStorageAccount({
          name: $accountNames[0],
          sku: "Premium_LRS",
          location: "uswest",
        });
      },
      else() {
        defineStorageAccount({
          name: $accountNames[0],
          sku: "Standard_LRS",
          location: "uswest",
        });
      },
    });
  },
  else() {
    when($usePremium, {
      do() {
        defineStorageAccount({
          name: $accountNames[0],
          sku: "Premium_LRS",
          location: "uswest",
        });

        defineStorageAccount({
          name: $accountNames[1],
          sku: "Premium_LRS",
          location: "uswest",
        });
      },
      else() {
        defineStorageAccount({
          name: $accountNames[0],
          sku: "Standard_LRS",
          location: "uswest",
        });

        defineStorageAccount({
          name: $accountNames[1],
          sku: "Standard_LRS",
          location: "uswest",
        });
      },
    });
  },
});
