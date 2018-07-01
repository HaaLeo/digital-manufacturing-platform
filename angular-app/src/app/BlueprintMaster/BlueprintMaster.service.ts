import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import {BlueprintMaster, QualityRequirement} from '../org.usecase.printer';
import 'rxjs/Rx';

import { Designer, Enduser, Printer, RequestBlueprint, CancelRequest} from 'app/org.usecase.printer';

// Can be injected into a constructor
@Injectable()
export class BlueprintMasterService {

	
		private NAMESPACE: string = 'org.usecase.printer.BlueprintMaster';
    private DESIGNER: string = 'org.usecase.printer.Designer';
    private PRINTER: string = 'org.usecase.printer.Printer';
    private ENDUSER: string = 'org.usecase.printer.Enduser';
    private QUALITY_REQUIREMENT: string = 'org.usecase.printer.QualityRequirement';
    private REQUESTBLUEPRINT: string = 'org.usecase.printer.RequestBlueprint';

    constructor(private dataService: DataService<BlueprintMaster>, 
                private designerService: DataService<Designer>, 
                private enduserService: DataService<Enduser>, 
                private printerService: DataService<Printer>,
                private qualityRequirementService: DataService<QualityRequirement>,
                private requestBlueprintService: DataService<RequestBlueprint>) {
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

  public getAllEndusers(): Observable<Enduser[]> {
    return this.enduserService.getAll(this.ENDUSER);
}

public getAllPrinters(): Observable<Printer[]> {
  return this.printerService.getAll(this.PRINTER);
}

    public getAllQualityRequirements(): Observable<QualityRequirement[]> {
        return this.qualityRequirementService.getAll(this.QUALITY_REQUIREMENT);
    }

//create requestBlueprint transaction
public requestBlueprint(itemToAdd: any): Observable<RequestBlueprint> {
        debugger;
        return this.requestBlueprintService.add(this.REQUESTBLUEPRINT, itemToAdd);
}

}
