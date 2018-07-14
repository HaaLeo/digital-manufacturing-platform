import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import {ConfirmTransaction, EvaluateReport} from '../org.usecase.printer';

import 'rxjs/Rx';
import { Designer, PrintingJob, Printer, Cash } from 'app/org.usecase.printer';

// Can be injected into a constructor
@Injectable()
export class BuyAssetTRService {

    private PRINTINGJOB: string = 'org.usecase.printer.PrintingJob';
    private CONFIRM_TRANSACTION: string = 'org.usecase.printer.ConfirmTransaction';
    private EVALUTE_REPORT: string = 'org.usecase.printer.EvaluateReport';

    constructor(private printingJobService: DataService<PrintingJob>, private confirmTransactionService: DataService<ConfirmTransaction>, private evaluateReportService: DataService<EvaluateReport>) {
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

    public returnPrivateKey() {
      return `-----BEGIN PGP PRIVATE KEY BLOCK-----

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
=fgQf
-----END PGP PRIVATE KEY BLOCK-----
`;
    }
}
