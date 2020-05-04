// could imagine these modules prefixed with `@azure/arm` instead of `./`
import { concat, uniquestring } from "./platform/string";
import {
  defineInputParameter,
  defineOutputParameter,
  defineLocationParameter,
  $resourceGroup,
} from "./platform/parameters";

import { defineStorageAccount, defineAccountTypeParameter } from "./storage";
import { emit } from "./emit";
import { defineResource } from "./platform/resources";

// identifiers prefixed with $ are Values. Values represent variables in the ARM template.

// common parameter types are provided
const $location = defineLocationParameter({ name: "Location" });
const $type = defineAccountTypeParameter({ name: "storageAccountType" });

// otherwise, call defineParameterType
const $manualLocation = defineInputParameter({
  name: "Manual Location",
  type: "string",
  defaultValue: "Standard_LRS",
  allowedValues: [
    "Standard_LRS",
    "Standard_GRS",
    "Standard_ZRS",
    "Premium_LRS",
  ],
  metadata: {
    description: "Storage Account type",
  },
});

// don't need arm variables since we have a convenient way to refer to an expression anyway
const $name = concat("store", uniquestring($resourceGroup.id));

/*
defineResource($name, {
  type: "Microsoft.Storage/storageAccounts",
  apiVersion: "2019-04-01",
  location: $location,
  sku: {
    name: $type,
  },
  kind: "StorageV2",
  properties: {},
});
*/

// or, use the convenient helper from the storage package
//defineStorageAccount($name, $location, $type);
defineOutputParameter({
  name: "storageAccountName",
  value: $name,
});

console.log(emit());
/*
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccountType": {
      "type": "string",
      "defaultValue": "Standard_LRS",
      "allowedValues": [
        "Standard_LRS",
        "Standard_GRS",
        "Standard_ZRS",
        "Premium_LRS"
      ],
      "metadata": {
        "description": "Storage Account type"
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location for all resources."
      }
    }
  },
  "variables": {
    "storageAccountName": "[concat('store', uniquestring(resourceGroup().id))]"
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2019-04-01",
      "name": "[variables('storageAccountName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "[parameters('storageAccountType')]"
      },
      "kind": "StorageV2",
      "properties": {}
    }
  ],
  "outputs": {
    "storageAccountName": {
      "type": "string",
      "value": "[variables('storageAccountName')]"
    }
  }
}
*/
