import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { BlueprintCopy, Designer, Printer, Enduser, BlueprintMaster } from '../org.usecase.printer';
import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class BlueprintCopyService {

	
    private NAMESPACE: string = 'org.usecase.printer.BlueprintCopy';
    private DESIGNER: string = 'org.usecase.printer.Designer';
    private PRINTER: string = 'org.usecase.printer.Printer';
    private ENDUSER: string = 'org.usecase.printer.Enduser';
    private BLUEPRINTMASTER: string = 'org.usecase.printer.BlueprintMaster';

    constructor(private dataService: DataService<BlueprintCopy>, private designerService: DataService<Designer>, private blueprintMasterService: DataService<BlueprintMaster>, private enduserService: DataService<Enduser>, private printerService: DataService<Printer>) {
    };

    public getAll(): Observable<BlueprintCopy[]> {
        return this.dataService.getAll(this.NAMESPACE);
    }

    public getAsset(id: any): Observable<BlueprintCopy> {
      return this.dataService.getSingle(this.NAMESPACE, id);
    }

    public addAsset(itemToAdd: any): Observable<BlueprintCopy> {
      return this.dataService.add(this.NAMESPACE, itemToAdd);
    }

    public updateAsset(id: any, itemToUpdate: any): Observable<BlueprintCopy> {
      return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
    }

    public deleteAsset(id: any): Observable<BlueprintCopy> {
      return this.dataService.delete(this.NAMESPACE, id);
    }

    public getID(str) {
      return str.split('#')[1];
    }

    public getAllEndusers(): Observable<Enduser[]> {
      return this.enduserService.getAll(this.ENDUSER);
   }
  
    public getAllPrinters(): Observable<Printer[]> {
      return this.printerService.getAll(this.PRINTER);
    }

    public getAllDesigners(): Observable<Designer[]> {
      return this.designerService.getAll(this.DESIGNER);
    }

    public getAllBlueprintMasters(): Observable<BlueprintMaster[]> {
      return this.blueprintMasterService.getAll(this.BLUEPRINTMASTER);
    }

    public getBlueprintMaster(id: any): Observable<BlueprintMaster> {
      return this.blueprintMasterService.getSingle(this.BLUEPRINTMASTER, id);
    }
}
