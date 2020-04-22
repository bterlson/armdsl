
// -------- Library code --------

namespace arm {

    export type Value<T> = {
        apply<U>(f: (value: T) => U): Value<U>;
    }

    export type ValueObject = {
        " valueObject "?: undefined;
    }

    export type Valuify<T> = {
        [K in keyof T]: ValueOrObject<T[K]>;
    }

    export type ValueOrObject<T> = T extends ValueObject ? Valuify<T> : Value<T>;

    export type Input<T> = T extends ValueObject ? InputObject<T> : T | Value<T>;

    export type InputObject<T> = {
        [K in keyof T]: Input<T[K]>;
    }

    export declare function getStringParameter(name: string): Value<string>;
    export declare function getNumericParameter(name: string): Value<number>;

    export type DeploymentLocation = {
        prop1: string;
        prop2: string;
        prop3: string;
    }

    export declare const deploymentLocation: Value<DeploymentLocation>;

    export type StorageAccountType = 'SAT_1' | 'SAT_2' | 'SAT_3';

    export type StorageAccountData = ValueObject & {
        name: string;
        location: DeploymentLocation;
        properties: ValueObject & {
            accountType: StorageAccountType;
            items: string[];
        };
    };

    export interface StorageAccount extends Valuify<StorageAccountData> {
        type: 'Microsoft.Storage/storageAccounts';
        apiVersion: '2015-06-15';
        id: Value<string>;
    }

    export declare function defineStorageAccount(data: Input<StorageAccountData>): StorageAccount;

    export type VirtualMachineData = ValueObject & {
        name: string;
        location: DeploymentLocation;
        size: number;
        storageAccountId: string;
    }

    export interface VirtualMachine extends Valuify<VirtualMachineData> {
        type: 'Microsoft.Compute/virtualMachines',
        apiVersion: '2019-07-01',
        id: Value<string>;
    }

    export declare function defineVirtualMachine(data: Input<VirtualMachineData>): VirtualMachine;
}

// -------- User code --------

const containerName = arm.Parameter({
  type: 'string',
  defaultValue: 'testAccount',
  minLength: 5,
  maxLength: 100
});


const myStorageAccount = arm.defineStorageAccount({
    name: concat(containerName),
    location: arm.deploymentLocation,
    properties: {
        accountType: 'SAT_2',
        items: ['foo', 'bar', 'baz']
    }
});

for (let i = 0; i < 5; i++) {
    const vm = arm.defineVirtualMachine({
        name: arm.getStringParameter('accountName').apply(s => `vm-${s}-${i}`),
        location: arm.deploymentLocation,
        size: arm.getNumericParameter('vmSize'),
        storageAccountId: myStorageAccount.id,
    });
}