import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { ConfirmTransaction } from '../org.usecase.printer';

import 'rxjs/Rx';
import { Customer, BlueprintCopy, Printer } from 'app/org.usecase.printer';

// Can be injected into a constructor
@Injectable()
export class BuyAssetTRService {

    private NAMESPACE: string = 'org.usecase.printer.BlueprintCopy';
    private BLUEPRINTCOPY: string = 'org.usecase.printer.BlueprintCopy';
    private CONFIRM_TRANSACTION: string = 'org.usecase.printer.ConfirmTransaction';

    constructor(private blueprintCopyService: DataService<BlueprintCopy>, private confirmTransactionService: DataService<ConfirmTransaction>) {
    };

    public getAllBlueprintCopies(): Observable<BlueprintCopy[]> {
        return this.blueprintCopyService.getAll(this.BLUEPRINTCOPY)
    }

    public printBlueprint(itemToAdd: any): Observable<ConfirmTransaction> {
      return this.confirmTransactionService.add(this.CONFIRM_TRANSACTION, itemToAdd);
    }
}