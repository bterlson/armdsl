import { defineInputParameter } from "../platform/parameters";
import { defineResource } from "../platform";
import {
  Value,
  CallExpressionNode,
  BoxValue,
  MemberExpressionNode,
  isValue,
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

export function defineStorageAccount(
  name: string | Value<string>,
  location: string | Value<string>,
  type: string | Value<string>
): Value<string> & Value<{ keys: StorageKeys }> {
  const baseValue = defineResource(
    name,
    "Microsoft.Storage/storageAccounts",
    API_VERSION,
    {
      location,
      sku: {
        name: type,
      },
      kind: "StorageV2",
      properties: {},
    }
  );

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
