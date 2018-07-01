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
}