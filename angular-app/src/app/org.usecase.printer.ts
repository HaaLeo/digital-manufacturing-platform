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
      // qualityRequirement: QualityRequirement
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

   export class CreatePrintingJob extends Transaction {
        printer: Printer;
        qualityRequirement: QualityRequirement;
    }
// }
