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
   export class Designer extends Stakeholder {
      firstName: string;
      lastName: string;
      contactInformation: string;
      cash: Cash;
   }
   export class Printer extends Stakeholder {
      name: string;
   }
   export enum OwnerEntity {
      Enduser,
      Designer,
   }
   export class Cash extends Asset {
      cashID: string;
      currency: string;
      value: number;
      ownerID: string;
      ownerEntity: OwnerEntity;
   }
   export class BlueprintMaster extends Asset {
      blueprintMasterID: string;
      assetHash: string;
      price: number;
      metadata: string;
      owner: Designer;
   }
   export class BlueprintCopy extends Asset {
      blueprintCopyID: string;
      printed: boolean;
      OTPencryptedWithDesignerPubKey: string;
      OTPencryptedWithPrinterPubKey: string;
      printer: Printer;
      buyer: Enduser;
      blueprintMaster: BlueprintMaster;
      owner: Stakeholder;
   }
   export class RequestBlueprint extends Transaction {
        buyer: Enduser;
        printer: Printer;
        blueprintMaster: BlueprintMaster;
    }
    export class ConfirmTransaction extends Transaction {
        blueprintCopy: BlueprintCopy;
    }
   export class ExecuteTransfer extends Transaction {
      printer: Printer;
      cashInc: Cash;
      cashDec: Cash;
      blueprintCopy: BlueprintCopy;
   }
// }
