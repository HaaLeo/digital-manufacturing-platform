import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { Cash, Designer, Enduser } from '../org.usecase.printer';
import 'rxjs/Rx';
import { EnduserComponent } from 'app/Enduser/Enduser.component';

// Can be injected into a constructor
@Injectable()
export class CashService {

	
    private CASH: string = 'org.usecase.printer.Cash';
    private DESIGNER: string = 'org.usecase.printer.Designer';
    private ENDUSER: string = 'org.usecase.printer.Enduser';
	



    constructor(private dataService: DataService<Cash>, private designerService: DataService<Designer>, private enduserService: DataService<Enduser>) {
    };

    public getAll(): Observable<Cash[]> {
        return this.dataService.getAll(this.CASH);
    }

    public getAsset(id: any): Observable<Cash> {
      return this.dataService.getSingle(this.CASH, id);
    }

    public addAsset(itemToAdd: any): Observable<Cash> {
      return this.dataService.add(this.CASH, itemToAdd);
    }

    public updateAsset(id: any, itemToUpdate: any): Observable<Cash> {
      return this.dataService.update(this.CASH, id, itemToUpdate);
    }

    public deleteAsset(id: any): Observable<Cash> {
      return this.dataService.delete(this.CASH, id);
    }

    /* //TODO do we need them??
    public deleteDesigner(id: any): Observable<Designer> {
      console.log("Deleting designer with id: ",id);
      return this.designerService.delete(this.DESIGNER, id);
    }

    public deleteEnduser(id: any): Observable<Enduser> {
      console.log("Deleting enduser with id: ",id);
      return this.enduserService.delete(this.DESIGNER, id);
    }
    */
}
