import { defineInputParameter } from "../platform/parameters";
import { defineResource, Resource, DefineResourceOptions } from "../platform";
import {
  Value,
  CallExpressionNode,
  MemberExpressionNode,
  Parameter,
  valueOf,
  ObjectValueDescriptor,
  callValue,
  memberValue,
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

interface StoragePrimaryEndpoints {
  blob: string;
}
interface StorageAccountResource {
  keys: StorageKey[];
  name: string;
  primaryEndpoints: StoragePrimaryEndpoints;
}

const PrimaryEndpointsDescriptor = {
  blob: "string",
} as const;

const StorageAccountDescriptor = {
  name: "string",
  keys: [StorageKeyDescriptor],
  primaryEndpoints: PrimaryEndpointsDescriptor,
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

interface DefineStorageAccountOptions extends Omit<DefineResourceOptions, "apiVersion" | "type"> {
  apiVersion?: string;
  sku: StorageAccountSku | Value<string>;
}
// todo : remove intersection
export function defineStorageAccount(
  options: DefineStorageAccountOptions
): Value<StorageAccountResource> {
  const baseValue = defineResource({
    name: options.name,
    type: "Microsoft.Storage/storageAccounts",
    apiVersion: options.apiVersion ?? API_VERSION,
    location: options.location,
    condition: options.condition,
    dependsOn: options.dependsOn,
    resource: {
      sku: {
        name: options.sku,
      },
      kind: "StorageV2",
      properties: {},
    },
  });

  const callExpr = listKeysCall(baseValue);
  const keysValue: Value<StorageKeys[]> = valueOf(callExpr, [StorageKeyDescriptor]);

  const primaryEndpointsValue = memberValue(
    baseValue,
    PrimaryEndpointsDescriptor,
    "properties",
    "primaryEndpoints"
  );

  return {
    ...baseValue,
    keys: keysValue,
    primaryEndpoints: primaryEndpointsValue,
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
export function defineAccountTypeParameter(options: AccountTypeParameterOptions) {
  return defineInputParameter({
    name: options.name,
    type: "string",
    defaultValue: "Standard_LRS",
    allowedValues: ["Standard_LRS", "Standard_GRS", "Standard_ZRS", "Premium_LRS"],
    metadata: {
      description: "Storage Account type",
    },
  });
}
