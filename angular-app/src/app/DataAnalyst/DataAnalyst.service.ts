import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import {DataAnalyst } from '../org.usecase.printer';

import { Cash } from '../org.usecase.printer';


import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class DataAnalystService {


	private DATAANALYST: string = 'org.usecase.printer.DataAnalyst';

    constructor(private dataAnalystService: DataService<DataAnalyst>) {
    };

    //DataAnalyst functions
    public getAllDataAnalysts(): Observable<DataAnalyst[]> {
        return this.dataAnalystService.getAll(this.DATAANALYST);
    }

    public getDataAnalyst(id: any): Observable<DataAnalyst> {
      return this.dataAnalystService.getSingle(this.DATAANALYST, id);
    }

    public addDataAnalyst(itemToAdd: any): Observable<DataAnalyst> {
      return this.dataAnalystService.add(this.DATAANALYST, itemToAdd);
    }

    public deleteDataAnalyst(id: any): Observable<DataAnalyst> {
      return this.dataAnalystService.delete(this.DATAANALYST, id);
    }

    public updateDataAnalyst(id: any, itemToUpdate: any): Observable<DataAnalyst> {
      return this.dataAnalystService.update(this.DATAANALYST, id, itemToUpdate);
    }

}
