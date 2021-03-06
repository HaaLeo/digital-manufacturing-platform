import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { QualityRequirement} from '../org.usecase.printer';
import 'rxjs/Rx';

import { Enduser, Printer } from 'app/org.usecase.printer';

// Can be injected into a constructor
@Injectable()
export class QualityRequirementService {

    private NAMESPACE = 'org.usecase.printer.QualityRequirement';
    private ENDUSER = 'org.usecase.printer.Enduser';
    private PRINTER = 'org.usecase.printer.Printer';

    constructor(private dataService: DataService<QualityRequirement>,
                private enduserService: DataService<Enduser>,
                private printerService: DataService<Printer>,) {
    };

    public getAll(): Observable<QualityRequirement[]> {
        return this.dataService.getAll(this.NAMESPACE);
    }

    public getAsset(id: any): Observable<QualityRequirement> {
      return this.dataService.getSingle(this.NAMESPACE, id);
    }

    public addAsset(itemToAdd: any): Observable<QualityRequirement> {
      return this.dataService.add(this.NAMESPACE, itemToAdd);
    }

    public updateAsset(id: any, itemToUpdate: any): Observable<QualityRequirement> {
      return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
    }

    public deleteAsset(id: any): Observable<QualityRequirement> {
      return this.dataService.delete(this.NAMESPACE, id);
    }

    public getEnduser(id: any): Observable<Enduser> {
      return this.enduserService.getSingle(this.ENDUSER, id);
    }

    public getAllEndusers(): Observable<Enduser[]> {
      return this.enduserService.getAll(this.ENDUSER);
    }

    public getAllPrinters(): Observable<Printer[]> {
      return this.printerService.getAll(this.PRINTER);
    }
}
