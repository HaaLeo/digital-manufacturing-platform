import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import {Printer, QualityReport} from '../org.usecase.printer';
import 'rxjs/Rx';

import { Enduser} from 'app/org.usecase.printer';

// Can be injected into a constructor
@Injectable()
export class QualityReportService {


    private NAMESPACE = 'org.usecase.printer.QualityReport';
    private PRINTER = 'org.usecase.printer.Printer';

    constructor(private dataService: DataService<QualityReport>,
                private printerService: DataService<Printer>) {
    };

    public getAll(): Observable<QualityReport[]> {
        return this.dataService.getAll(this.NAMESPACE);
    }

    public getAsset(id: any): Observable<QualityReport> {
        return this.dataService.getSingle(this.NAMESPACE, id);
    }

    public addAsset(itemToAdd: any): Observable<QualityReport> {
        return this.dataService.add(this.NAMESPACE, itemToAdd);
    }

    public updateAsset(id: any, itemToUpdate: any): Observable<QualityReport> {
        return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
    }

    public deleteAsset(id: any): Observable<QualityReport> {
        return this.dataService.delete(this.NAMESPACE, id);
    }


    public getPrinter(id: any): Observable<Printer> {
        return this.printerService.getSingle(this.PRINTER, id);
    }

    public getAllPrinters(): Observable<Printer[]> {
        return this.printerService.getAll(this.PRINTER);
    }


}
