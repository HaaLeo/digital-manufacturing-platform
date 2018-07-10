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
      printerManufacturer: string;
   }
   export class Manufacturer extends Stakeholder {
      name: string;
   }

   export class DataAnalyst extends Stakeholder {
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
      txID: string;
      checksum: string;
      price: number;
      metadata: string;
      owner: Designer;
   }
   export class PrintingJob extends Asset {
       printingJobID: string;
      txID: string;
      checksum: string;
      printed: boolean;
      otpEncryptedWithDesignerPubKey: string;
      otpEncryptedWithPrinterPubKey: string;
      printer: Printer;
      buyer: Enduser;
      blueprintMaster: BlueprintMaster;
      owner: Stakeholder;
      qualityRequirement: QualityRequirement;
   }

   export class EvaluationResult extends Asset {
       evaluationResultID: string;
       txID: string;
       requirementsMet: boolean;
       printingJob: PrintingJob;
       customer: Stakeholder;
       qualityReport: QualityReport;
       manufacturer: Manufacturer;
   }


    export class QualityReport extends Asset {
        qualityReportID: string;
        accessPermissionCode: string; // IPFS address
        databaseHash: string;
        owner: Manufacturer;
        printingJob: PrintingJob;
    }


    export class QualityReportRaw extends Asset {
        qualityReportRawID: String;
        encryptedReport: String;
        accessPermissionCode: String;
        printingJob: PrintingJob;
        stakeholder: Stakeholder[];
    }

   export class QualityRequirement extends Asset {
       name: string;
       qualityRequirementID: string;
       txID: string;
       owner: Enduser;
   }

   export class RequestBlueprint extends Transaction {
        buyer: Enduser;
        printer: Printer;
        blueprintMaster: BlueprintMaster;
        qualityRequirement: QualityRequirement;
    }

   export class CancelRequest extends Transaction {
       printingJob: PrintingJob;
   }

   export class ConfirmTransaction extends Transaction {
       printingJob: PrintingJob;
   }

   export class ConfirmPrintingJob extends Transaction {
       txID: string;
       checksum: string;
       printingJob: PrintingJob;
   }

   export class EvaluateReport extends Transaction {
       pressure: number;
       temperature: number;
       peakPressure: number;
       peakTemperature: number;
       printingJob: PrintingJob; // includes Quality Requirement and BlueprintMaster
       customer: Stakeholder;
       qualityReport: QualityReport;
       manufacturer: Manufacturer;
   }


// }
