import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { BlueprintCopy, Designer, Printer, Enduser, QualityRequirement, CancelRequest, UploadBlueprintCopy} from '../org.usecase.printer';
import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class BlueprintCopyService {

	
    private NAMESPACE: string = 'org.usecase.printer.BlueprintCopy';
    private DESIGNER: string = 'org.usecase.printer.Designer';
    private PRINTER: string = 'org.usecase.printer.Printer';
    private ENDUSER: string = 'org.usecase.printer.Enduser';
    private QUALITYREQUIREMENT: string = 'org.usecase.printer.QualityRequirement';
    private CANCELREQUEST: string = 'org.usecase.printer.CancelRequest';
    private UPDATEREQUEST: string = 'org.usecase.printer.UploadBlueprintCopy';

    constructor(private dataService: DataService<BlueprintCopy>, private designerService: DataService<Designer>, private uploadBlueprintCopyService: DataService<UploadBlueprintCopy>, private cancelRequestService: DataService<CancelRequest>,  private qualityRequirementService: DataService<QualityRequirement>, private enduserService: DataService<Enduser>, private printerService: DataService<Printer>) {
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

    public cancel(itemToCancel: any): Observable<CancelRequest> {
      return this.cancelRequestService.add(this.CANCELREQUEST,itemToCancel);
    }

    public upload(itemToUpload: any): Observable<UploadBlueprintCopy> {
      return this.uploadBlueprintCopyService.add(this.UPDATEREQUEST,itemToUpload);
    }

    public getAllBlueprintCopies(): Observable<BlueprintCopy[]> {
      return this.dataService.getAll(this.NAMESPACE);
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

    public getAllQualityRequirements(): Observable<QualityRequirement[]> {
      return this.qualityRequirementService.getAll(this.QUALITYREQUIREMENT);
    }

    public getQualityRequirement(id: any): Observable<QualityRequirement> {
      return this.qualityRequirementService.getSingle(this.QUALITYREQUIREMENT, id);
    }
}
