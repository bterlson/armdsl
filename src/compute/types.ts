import { TypeFromDescriptor, Parameter, Value } from "../types";
import { DefineResourceOptions } from "..";
export const API_VERSION = "2019-12-01";

export const VirtualMachineResourceDescriptor = {
  name: "string",
  type: "Microsoft.Compute/virtualMachines",
  apiVersion: "2019-12-01",
  location: "string",
  tags: {},
  plan: {
    name: "string",
    publisher: "string",
    product: "string",
    promotionCode: "string",
  },
  properties: {
    hardwareProfile: {
      vmSize: "string",
    },
    storageProfile: {
      imageReference: {
        id: "string",
        publisher: "string",
        offer: "string",
        sku: "string",
        version: "string",
      },
      osDisk: {
        osType: "string",
        encryptionSettings: {
          diskEncryptionKey: {
            secretUrl: "string",
            sourceVault: {
              id: "string",
            },
          },
          keyEncryptionKey: {
            keyUrl: "string",
            sourceVault: {
              id: "string",
            },
          },
          enabled: "boolean",
        },
        name: "string",
        vhd: {
          uri: "string",
        },
        image: {
          uri: "string",
        },
        caching: "string",
        writeAcceleratorEnabled: "boolean",
        diffDiskSettings: {
          option: "Local",
          placement: "string",
        },
        createOption: "string",
        diskSizeGB: "number",
        managedDisk: {
          id: "string",
          storageAccountType: "string",
          diskEncryptionSet: {
            id: "string",
          },
        },
      },
      dataDisks: [
        {
          lun: "number",
          name: "string",
          vhd: {
            uri: "string",
          },
          image: {
            uri: "string",
          },
          caching: "string",
          writeAcceleratorEnabled: "boolean",
          createOption: "string",
          diskSizeGB: "number",
          managedDisk: {
            id: "string",
            storageAccountType: "string",
            diskEncryptionSet: {
              id: "string",
            },
          },
          toBeDetached: "boolean",
        },
      ],
    },
    additionalCapabilities: {
      ultraSSDEnabled: "boolean",
    },
    osProfile: {
      computerName: "string",
      adminUsername: "string",
      adminPassword: "string",
      customData: "string",
      windowsConfiguration: {
        provisionVMAgent: "boolean",
        enableAutomaticUpdates: "boolean",
        timeZone: "string",
        additionalUnattendContent: [
          {
            passName: "OobeSystem",
            componentName: "Microsoft-Windows-Shell-Setup",
            settingName: "string",
            content: "string",
          },
        ],
        winRM: {
          listeners: [
            {
              protocol: "string",
              certificateUrl: "string",
            },
          ],
        },
      },
      linuxConfiguration: {
        disablePasswordAuthentication: "boolean",
        ssh: {
          publicKeys: [
            {
              path: "string",
              keyData: "string",
            },
          ],
        },
        provisionVMAgent: "boolean",
      },
      secrets: [
        {
          sourceVault: {
            id: "string",
          },
          vaultCertificates: [
            {
              certificateUrl: "string",
              certificateStore: "string",
            },
          ],
        },
      ],
      allowExtensionOperations: "boolean",
      requireGuestProvisionSignal: "boolean",
    },
    networkProfile: {
      networkInterfaces: [
        {
          id: "string",
          properties: {
            primary: "boolean",
          },
        },
      ],
    },
    diagnosticsProfile: {
      bootDiagnostics: {
        enabled: "boolean",
        storageUri: "string",
      },
    },
    availabilitySet: {
      id: "string",
    },
    virtualMachineScaleSet: {
      id: "string",
    },
    proximityPlacementGroup: {
      id: "string",
    },
    priority: "string",
    evictionPolicy: "string",
    billingProfile: {
      maxPrice: "number",
    },
    host: {
      id: "string",
    },
    licenseType: "string",
  },
  identity: {
    type: "string",
    userAssignedIdentities: {},
  },
  zones: ["string"],
  resources: [],
} as const;

export type VirtualMachineResource = TypeFromDescriptor<typeof VirtualMachineResourceDescriptor>;

// TODO: can probably calculate the type, but the descriptor doesn't reflect optionality.
export interface DefineVirtualMachineOptions
  extends Omit<DefineResourceOptions, "apiVersion" | "type"> {
  plan?: Parameter<{
    name?: string;
    publisher?: string;
    product?: string;
    promotionCode?: string;
  }>;
  properties: Parameter<{
    hardwareProfile?: {
      vmSize?: string;
    };
    storageProfile?: {
      imageReference?: {
        id?: string;
        publisher?: string;
        offer?: string;
        sku?: string;
        version?: string;
      };
      osDisk?: {
        osType?: string;
        encryptionSettings?: {
          diskEncryptionKey?: {
            secretUrl: string;
            sourceVault: {
              id?: string;
            };
          };
          keyEncryptionKey?: {
            keyUrl: string;
            sourceVault: {
              id?: string;
            };
          };
          enabled?: boolean;
        };
        name?: string;
        vhd?: {
          uri?: string;
        };
        image?: {
          uri?: string;
        };
        caching?: string;
        writeAcceleratorEnabled?: boolean;
        diffDiskSettings?: {
          option?: "Local";
          placement?: string;
        };
        createOption: string;
        diskSizeGB?: number;
        managedDisk?: {
          id?: string;
          storageAccountType?: string;
          diskEncryptionSet?: {
            id?: string;
          };
        };
      };
      dataDisks?: {
        lun: number;
        name?: string;
        vhd?: {
          uri?: string;
        };
        image?: {
          uri?: string;
        };
        caching?: string;
        writeAcceleratorEnabled?: boolean;
        createOption: string;
        diskSizeGB?: number;
        managedDisk?: {
          id?: string;
          storageAccountType?: string;
          diskEncryptionSet?: {
            id?: string;
          };
        };
        toBeDetached?: boolean;
      }[];
    };
    additionalCapabilities?: {
      ultraSSDEnabled?: boolean;
    };
    osProfile?: {
      computerName?: string;
      adminUsername?: string;
      adminPassword?: string;
      customData?: string;
      windowsConfiguration?: {
        provisionVMAgent?: boolean;
        enableAutomaticUpdates?: boolean;
        timeZone?: string;
        additionalUnattendContent?: [
          {
            passName?: "OobeSystem";
            componentName?: "Microsoft-Windows-Shell-Setup";
            settingName?: string;
            content?: string;
          }
        ];
        winRM?: {
          listeners?: [
            {
              protocol?: string;
              certificateUrl?: string;
            }
          ];
        };
      };
      linuxConfiguration?: {
        disablePasswordAuthentication?: boolean;
        ssh?: {
          publicKeys?: [
            {
              path?: string;
              keyData?: string;
            }
          ];
        };
        provisionVMAgent?: boolean;
      };
      secrets?: [
        {
          sourceVault?: {
            id?: string;
          };
          vaultCertificates?: [
            {
              certificateUrl?: string;
              certificateStore?: string;
            }
          ];
        }
      ];
      allowExtensionOperations?: boolean;
      requireGuestProvisionSignal?: boolean;
    };
    networkProfile?: {
      networkInterfaces?: [
        {
          id?: string;
          properties?: {
            primary?: boolean;
          };
        }
      ];
    };
    diagnosticsProfile?: {
      bootDiagnostics?: {
        enabled?: boolean;
        storageUri?: string;
      };
    };
    availabilitySet?: {
      id?: string;
    };
    virtualMachineScaleSet?: {
      id?: string;
    };
    proximityPlacementGroup?: {
      id?: string;
    };
    priority?: string;
    evictionPolicy?: string;
    billingProfile?: {
      maxPrice?: number;
    };
    host?: {
      id?: string;
    };
    licenseType?: string;
  }>;

  identity?: {
    type: string;
    userAssignedIdentities: {};
  };
  zones?: string[];
  resources?: []; // todo: extensions
}
