import { Value, valueOf } from "../types";
import {
  DefineVirtualMachineOptions,
  VirtualMachineResource,
  VirtualMachineResourceDescriptor,
} from "./types";
import { defineResource } from "..";

export function defineVirtualMachine(
  options: DefineVirtualMachineOptions
): Value<VirtualMachineResource> {
  const baseValue = defineResource({
    type: "Microsoft.Compute/virtualMachines",
    apiVersion: "2019-12-01",
    ...options,
  });

  const vmValue = valueOf(baseValue[" value"], VirtualMachineResourceDescriptor);

  return {
    ...vmValue,
    ...baseValue,
  };
}
