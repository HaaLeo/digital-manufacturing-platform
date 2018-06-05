import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.usecase.printer{
   export abstract class Stakeholder extends Participant {
      stakeholderID: string;
      pubKey: string;
   }
   export class Customer extends Stakeholder {
      firstName: string;
      lastName: string;
   }
   export class Printer extends Stakeholder {
      name: string;
   }

   export class QualityRequirement extends Asset {
      qualityRequirementID: string;
      txID: string;
      checksum: string;
      metadata: string;
      peakTemperature: number;
      pressure: number;
      owner: Customer;
   }

   export class PrintingJob extends Asset {
       printingJobID: string;
       txID: string;
       checksum: string;
       metadata: string;
       blueprint: string;
       printer: Printer;
       customer: Customer;
   }

    export class EvluationResult extends Asset {
        evaluationResultID: string;
        txID: string;
        checksum: string;
        metadata: string;
        printingJobID: string;
        has_passed: boolean;
        customer: Customer;
}


export class CreatePrintingJob extends Transaction {
        printer: Printer;
        qualityRequirement: QualityRequirement;
    }
// }
