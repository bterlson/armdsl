import { defineInputParameter } from "../parameters";

export function defineStorageAccount(name: any, location: any, type: any) {}

export function defineAccountTypeParameter(name: string) {
  return defineInputParameter(name, "string", {
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
}
