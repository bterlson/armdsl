import { defineInputParameter } from "../platform/parameters";
import { defineResource } from "../platform";
import {
  Value,
  CallExpressionNode,
  BoxValue,
  MemberExpressionNode,
  Parameter,
} from "../types";

const API_VERSION = "2019-04-01";
interface StorageKey {
  keyName: string;
  permission: string;
  value: string;
}

type StorageKeys = {
  [keyNum: number]: StorageKey;
};

function listKeysCall(ref: Value<string>) {
  const listKeysCall: CallExpressionNode = {
    type: "callExpression",
    target: "listKeys",
    args: [ref, BoxValue(API_VERSION)],
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
): Value<string> & Value<{ keys: StorageKeys }> {
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

  const keysValue: Value<StorageKeys> = {
    type: "value",
    valueType: "future",
    ref: callExpr,
  };

  const arrayProxy = new Proxy(keysValue, {
    get(target, prop, receiver) {
      // todo: when is `prop` typeof number?
      if (typeof prop === "string" && Number.isInteger(parseFloat(prop))) {
        const indexMemberExpr = {
          type: "memberExpr",
          lhs: callExpr,
          rhs: parseInt(prop),
        };

        return {
          type: "value",
          valueType: "future",
          ref: indexMemberExpr,
          keyName: {
            type: "value",
            valueType: "future",
            ref: {
              type: "memberExpr",
              lhs: indexMemberExpr,
              rhs: "keyName",
            },
          },
          permission: {
            type: "value",
            valueType: "future",
            ref: {
              type: "memberExpr",
              lhs: indexMemberExpr,
              rhs: "permission",
            },
          },
          value: {
            type: "value",
            valueType: "future",
            ref: {
              type: "memberExpr",
              lhs: indexMemberExpr,
              rhs: "value",
            },
          },
        };
      } else {
        return Reflect.get(target, prop, receiver);
      }
    },
  });

  return {
    ...baseValue,
    keys: arrayProxy,
  } as any;
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
