import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.usecase.printer{
   export abstract class Stakeholder extends Participant {
      stakeholderID: string;
      pubKey: string;
   }
   export class Enduser extends Stakeholder {
      firstName: string;
      lastName: string;
      contactInformation: string;
      cash: Cash;
   }
   export class Customer extends Stakeholder {
      firstName: string;
      lastName: string;
      cash: Cash;
   }
   export class Printer extends Stakeholder {
      name: string;
   }
   export enum OwnerEntity {
      Enduser,
      Customer,
   }
   export class Cash extends Asset {
      cashID: string;
      currency: string;
      value: number;
      ownerID: string;
      ownerEntity: OwnerEntity;
   }
   export class QualityRequirement extends Asset {
      qualityRequirementID: string;
      txID: string;
      checksum: string;
      price: number;
      metadata: string;
      peakTemperature: number;
      pressure: number;
      owner: Customer;
   }
   export class BlueprintCopy extends Asset {
      blueprintCopyID: string;
      txID: string;
      checksum: string;
      printed: boolean;
      otpEncryptedWithCustomerPubKey: string;
      otpEncryptedWithPrinterPubKey: string;
      printer: Printer;
      buyer: Enduser;
      qualityRequirement: QualityRequirement;
      owner: Stakeholder;
   }
   export class RequestBlueprint extends Transaction {
        buyer: Enduser;
        printer: Printer;
        qualityRequirement: QualityRequirement;
    }
    export class CancelRequest extends Transaction {
        blueprintCopy: BlueprintCopy;
    }
    export class ConfirmTransaction extends Transaction {
        blueprintCopy: BlueprintCopy;
    }
    export class UploadBlueprintCopy extends Transaction {
        txID: string;
        checksum: string;
        blueprintCopy: BlueprintCopy;
    }
// }
