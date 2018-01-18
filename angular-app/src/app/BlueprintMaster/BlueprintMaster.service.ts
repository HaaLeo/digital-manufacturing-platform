import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { BlueprintMaster } from '../org.usecase.printer';
import 'rxjs/Rx';

import { Designer} from 'app/org.usecase.printer';

// Can be injected into a constructor
@Injectable()
export class BlueprintMasterService {

	
		private NAMESPACE: string = 'org.usecase.printer.BlueprintMaster';
    private DESIGNER: string = 'org.usecase.printer.Designer';

    constructor(private dataService: DataService<BlueprintMaster>, private designerService: DataService<Designer>) {
    };

    public getAll(): Observable<BlueprintMaster[]> {
        return this.dataService.getAll(this.NAMESPACE);
    }

    public getAsset(id: any): Observable<BlueprintMaster> {
      return this.dataService.getSingle(this.NAMESPACE, id);
    }

    public addAsset(itemToAdd: any): Observable<BlueprintMaster> {
      return this.dataService.add(this.NAMESPACE, itemToAdd);
    }

    public updateAsset(id: any, itemToUpdate: any): Observable<BlueprintMaster> {
      return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
    }

    public deleteAsset(id: any): Observable<BlueprintMaster> {
      return this.dataService.delete(this.NAMESPACE, id);
    }

    public getAllDesigners(): Observable<Designer[]> {
      return this.designerService.getAll(this.DESIGNER);
  }

  public getDesigner(id: any): Observable<Designer> {
    return this.designerService.getSingle(this.DESIGNER, id);
  }

}
