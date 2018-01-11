import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';

import 'rxjs/Rx';
import { Designer, BlueprintCopy, Printer, Cash } from 'app/org.usecase.printer';

// Can be injected into a constructor
@Injectable()
export class BuyAssetTRService {

    private NAMESPACE: string = 'org.usecase.printer.BlueprintCopy';
    private BLUEPRINTCOPY: string = 'org.usecase.printer.BlueprintCopy';

    constructor(private printerService: DataService<Printer>, private cashIncService: DataService<Cash>, private cashDecService: DataService<Cash>, private blueprintCopyService: DataService<BlueprintCopy>) {
    };

    // //get all Printers
    // public getAllPrinters(): Observable<Printer[]> {
    //     return this.printerService.getAll(this.PRINTER);
    // }

    public getAllBlueprintCopies(): Observable<BlueprintCopy[]> {
        return this.blueprintCopyService.getAll(this.BLUEPRINTCOPY)
    }

}