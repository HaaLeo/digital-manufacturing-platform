import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { ConfirmTransaction } from '../org.usecase.printer';

import 'rxjs/Rx';
import { Designer, PrintingJob, Printer, Cash } from 'app/org.usecase.printer';

// Can be injected into a constructor
@Injectable()
export class BuyAssetTRService {

    private NAMESPACE: string = 'org.usecase.printer.PrintingJob';
    private PRINTINGJOB: string = 'org.usecase.printer.PrintingJob';
    private CONFIRM_TRANSACTION: string = 'org.usecase.printer.ConfirmTransaction';

    constructor(private printingJobService: DataService<PrintingJob>, private confirmTransactionService: DataService<ConfirmTransaction>) {
    };

    public getAllPrintingJobs(): Observable<PrintingJob[]> {
        return this.printingJobService.getAll(this.PRINTINGJOB);
    }

    public printBlueprint(itemToAdd: any): Observable<ConfirmTransaction> {
        debugger;
      return this.confirmTransactionService.add(this.CONFIRM_TRANSACTION, itemToAdd);
    }
}