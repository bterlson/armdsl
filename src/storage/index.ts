import { defineInputParameter } from "../platform/parameters";
import { defineResource, Resource } from "../platform";
import {
  Value,
  CallExpressionNode,
  MemberExpressionNode,
  Parameter,
  valueOf,
  ObjectValueDescriptor,
} from "../types";

const API_VERSION = "2019-04-01";
interface StorageKey {
  keyName: string;
  permission: string;
  value: string;
}

const StorageKeyDescriptor = {
  keyName: "string",
  permission: "string",
  value: "string",
} as const;

interface StorageAccountResource {
  keys: StorageKey[];
  name: string;
}

const StorageAccountDescriptor = {
  name: "string",
  keys: [StorageKeyDescriptor],
} as const;

type StorageKeys = {
  [keyNum: number]: StorageKey;
};

function listKeysCall(ref: Value<Resource>) {
  const listKeysCall: CallExpressionNode = {
    type: "callExpression",
    target: "listKeys",
    args: [ref.name, API_VERSION],
  };

  const memberExpr: MemberExpressionNode = {
    type: "memberExpr",
    lhs: listKeysCall,
    rhs: "keys",
  };

  return memberExpr;
}

type StorageAccountType =
  | "Storage"
  | "StorageV2"
  | "BlobStorage"
  | "FileStorage"
  | "BlockBlobStorage";

type StorageAccountSku =
  | "Standard_LRS"
  | "Standard_GRS"
  | "Standard_RAGRS"
  | "Standard_ZRS"
  | "Premium_LRS"
  | "Premium_ZRS"
  | "Standard_GZRS"
  | "Standard_RAGZRS";

interface DefineStorageAccountOptions {
  name: Parameter<string>;
  location: Parameter<string>;
  sku: StorageAccountSku | Value<string>;
}
// todo : remove intersection
export function defineStorageAccount(
  options: DefineStorageAccountOptions
): Value<StorageAccountResource> {
  const baseValue = defineResource({
    name: options.name,
    type: "Microsoft.Storage/storageAccounts",
    apiVersion: API_VERSION,
    resource: {
      location: options.location,
      sku: {
        name: options.sku,
      },
      kind: "StorageV2",
      properties: {},
    },
  });

  const callExpr = listKeysCall(baseValue);
  const keysValue: Value<StorageKeys[]> = valueOf(callExpr, [
    StorageKeyDescriptor,
  ]);

  return {
    ...baseValue,
    keys: keysValue,
  } as any; // ?
}

interface AccountTypeParameterOptions {
  name: string;
}
/**
 * Define an input parameter that prompts for a storage account type.
 *
 * @param name The name of this parameter
 */
export function defineAccountTypeParameter(
  options: AccountTypeParameterOptions
) {
  return defineInputParameter({
    name: options.name,
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
}
