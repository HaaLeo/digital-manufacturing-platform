import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import {Printer, QualityReport, QualityReportRawData} from '../org.usecase.printer';
import 'rxjs/Rx';

import { Enduser} from 'app/org.usecase.printer';

// Can be injected into a constructor
@Injectable()
export class QualityReportRawDataService {


    private NAMESPACE = 'org.usecase.printer.QualityReportRawData';

    constructor(private dataService: DataService<QualityReportRawData>) {
    };

    public getAll(): Observable<QualityReportRawData[]> {
        return this.dataService.getAll(this.NAMESPACE);
    }

    public getAsset(id: any): Observable<QualityReportRawData> {
        return this.dataService.getSingle(this.NAMESPACE, id);
    }

    public addAsset(itemToAdd: any): Observable<QualityReportRawData> {
        return this.dataService.add(this.NAMESPACE, itemToAdd);
    }

    public updateAsset(id: any, itemToUpdate: any): Observable<QualityReportRawData> {
        return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
    }

    public deleteAsset(id: any): Observable<QualityReportRawData> {
        return this.dataService.delete(this.NAMESPACE, id);
    }

}
