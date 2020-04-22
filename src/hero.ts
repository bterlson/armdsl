import { concat } from "./string";
import { defineLocationParameter, defineInputParameter } from "./parameters";
import { defineStorageAccount, defineAccountTypeParameter } from "./storage";
import { defineVirtualMachine } from "./vm";

const $location = defineLocationParameter("Location");
const $type = defineAccountTypeParameter("storageAccountType");
const $name = defineInputParameter("name", "string");
const $storage = defineStorageAccount(concat("st-", $name), $location, $type);

for (let i = 0; i < 5; i++) {
  defineVirtualMachine({
    name: concat("vm-", $name, i),
    location: $location,
    size: 1,
    storageAccountId: $storage.id,
  });
}

// parameterized loops
const $count = defineInputParameter("Number of VMs", "number");
loop(1, $count, ($i) => {
  defineVirtualMachine({
    name: concat("vm-", $name, $i),
    location: $location,
    size: 1,
    storageAccountId: $storage.id,
  });
});
