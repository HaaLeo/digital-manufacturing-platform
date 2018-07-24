import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import {ConfirmTransaction, EvaluateReport} from '../org.usecase.printer';

import 'rxjs/Rx';
import { Designer, PrintingJob, Printer, Cash, Enduser } from 'app/org.usecase.printer';

// Can be injected into a constructor
@Injectable()
export class BuyAssetTRService {

    private PRINTINGJOB: string = 'org.usecase.printer.PrintingJob';
    private CONFIRM_TRANSACTION: string = 'org.usecase.printer.ConfirmTransaction';
    private EVALUTE_REPORT: string = 'org.usecase.printer.EvaluateReport';
    private ENDUSER = 'org.usecase.printer.Enduser';

    constructor(private printingJobService: DataService<PrintingJob>,
                private confirmTransactionService: DataService<ConfirmTransaction>,
                private evaluateReportService: DataService<EvaluateReport>,
                private enduserService: DataService<Enduser>) {
    };

    public getAllPrintingJobs(): Observable<PrintingJob[]> {
        return this.printingJobService.getAll(this.PRINTINGJOB);
    }

    public printBlueprint(itemToAdd: any): Observable<ConfirmTransaction> {
      return this.confirmTransactionService.add(this.CONFIRM_TRANSACTION, itemToAdd);
    }

    public evaluateReport(itemToEvaluate: any): Observable<EvaluateReport>{
        return this.evaluateReportService.add(this.EVALUTE_REPORT, itemToEvaluate);
    }

    public getAllEndusers(): Observable<Enduser[]> {
      return this.enduserService.getAll(this.ENDUSER);
    }

    //Returns PGP public key of the printer
    public returnPrinterPrivateKey() {
      return `-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: OpenPGP v2.0.8
Comment: https://sela.io/pgp/

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
0XWGjAk=
=TK0b
-----END PGP PRIVATE KEY BLOCK-----
`;
    }
}
