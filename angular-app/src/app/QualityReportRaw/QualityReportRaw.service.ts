import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { QualityReportRaw } from '../org.usecase.printer';
import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class QualityReportRawService {


    private NAMESPACE = 'org.usecase.printer.QualityReportRaw';

    constructor(private dataService: DataService<QualityReportRaw>) {
    };

    public getAll(): Observable<QualityReportRaw[]> {
        return this.dataService.getAll(this.NAMESPACE);
    }

    public getAsset(id: any): Observable<QualityReportRaw> {
        return this.dataService.getSingle(this.NAMESPACE, id);
    }

    public addAsset(itemToAdd: any): Observable<QualityReportRaw> {
        return this.dataService.add(this.NAMESPACE, itemToAdd);
    }

    public updateAsset(id: any, itemToUpdate: any): Observable<QualityReportRaw> {
        return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
    }

    public deleteAsset(id: any): Observable<QualityReportRaw> {
        return this.dataService.delete(this.NAMESPACE, id);
    }

}
