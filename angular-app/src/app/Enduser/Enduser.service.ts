import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { Enduser } from '../org.usecase.printer';


import { BlueprintMaster } from '../org.usecase.printer';
import { BlueprintCopy } from '../org.usecase.printer';
import { Cash } from '../org.usecase.printer';


import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class EnduserService {

	
	private ENDUSER: string = 'org.usecase.printer.Enduser';  
    private CASH: string = 'org.usecase.printer.Cash';
	
    constructor(private enduserService: DataService<Enduser>, private cashService: DataService<Cash>) {
    };

    //enduser functions
    public getAllEndusers(): Observable<Enduser[]> {
        return this.enduserService.getAll(this.ENDUSER);
    }

    public getEnduser(id: any): Observable<Enduser> {
      return this.enduserService.getSingle(this.ENDUSER, id);
    }

    public addEnduser(itemToAdd: any): Observable<Enduser> {
      return this.enduserService.add(this.ENDUSER, itemToAdd);
    }

    public deleteEnduser(id: any): Observable<Enduser> {
      return this.enduserService.delete(this.ENDUSER, id);
    }

    public updateEnduser(id: any, itemToUpdate: any): Observable<Enduser> {
      return this.enduserService.update(this.ENDUSER, id, itemToUpdate);
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