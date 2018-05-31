import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { CancelRequest } from '../org.usecase.printer';

import 'rxjs/Rx';
import { Customer, BlueprintCopy, Printer } from 'app/org.usecase.printer';

// Can be injected into a constructor
@Injectable()
export class CancelRequestTRService {

    private BLUEPRINTCOPY: string = 'org.usecase.printer.BlueprintCopy';
    private CANCEL_TRANSACTION: string = 'org.usecase.printer.CancelRequest';

    constructor(private blueprintCopyService: DataService<BlueprintCopy>, private cancelRequestService: DataService<CancelRequest>) {
    };

    public getAllBlueprintCopies(): Observable<BlueprintCopy[]> {
        return this.blueprintCopyService.getAll(this.BLUEPRINTCOPY)
    }

    public cancelRequest(itemToAdd: any): Observable<CancelRequest> {
      return this.cancelRequestService.add(this.CANCEL_TRANSACTION, itemToAdd);
    }
}