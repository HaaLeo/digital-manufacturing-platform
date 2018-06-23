import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { CancelRequest } from '../org.usecase.printer';

import 'rxjs/Rx';
import { Designer, PrintingJob, Printer, Cash } from 'app/org.usecase.printer';

// Can be injected into a constructor
@Injectable()
export class CancelRequestTRService {

    private PRINTINGJOB: string = 'org.usecase.printer.PrintingJob';
    private CANCEL_TRANSACTION: string = 'org.usecase.printer.CancelRequest';

    constructor(private printingJobService: DataService<PrintingJob>, private cancelRequestService: DataService<CancelRequest>) {
    };

    public getAllPrintingJobs(): Observable<PrintingJob[]> {
        return this.printingJobService.getAll(this.PRINTINGJOB)
    }

    public cancelRequest(itemToAdd: any): Observable<CancelRequest> {
      return this.cancelRequestService.add(this.CANCEL_TRANSACTION, itemToAdd);
    }
}