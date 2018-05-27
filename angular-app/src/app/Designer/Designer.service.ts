import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { Designer } from '../org.usecase.printer';


import { QualityRequirement } from '../org.usecase.printer';
import { BlueprintCopy } from '../org.usecase.printer';
import { Cash } from '../org.usecase.printer';


import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class DesignerService {

	
	private DESIGNER: string = 'org.usecase.printer.Designer';  
    private CASH: string = 'org.usecase.printer.Cash';
	
    constructor(private designerService: DataService<Designer>, private cashService: DataService<Cash>) {
    };

    //Designer functions
    public getAllDesigners(): Observable<Designer[]> {
        return this.designerService.getAll(this.DESIGNER);
    }

    public getDesigner(id: any): Observable<Designer> {
      return this.designerService.getSingle(this.DESIGNER, id);
    }

    public addDesigner(itemToAdd: any): Observable<Designer> {
      return this.designerService.add(this.DESIGNER, itemToAdd);
    }

    public deleteDesigner(id: any): Observable<Designer> {
      return this.designerService.delete(this.DESIGNER, id);
    }

    public updateDesigner(id: any, itemToUpdate: any): Observable<Designer> {
      return this.designerService.update(this.DESIGNER, id, itemToUpdate);
    }

    //cash functions
    public getAllCash(): Observable<Cash[]> {
        return this.cashService.getAll(this.CASH);
    }

    public getCash(id: any): Observable<Cash> {
      return this.cashService.getSingle(this.CASH, id);
    }

    public addCash(itemToAdd: any): Observable<Cash> {
      return this.cashService.add(this.CASH, itemToAdd);
    }

    public updateCash(id: any, itemToUpdate: any): Observable<Cash> {
      return this.cashService.update(this.CASH, id, itemToUpdate);
    }

    public deleteCash(id: any): Observable<Cash> {
      return this.cashService.delete(this.CASH, id);
    }

}