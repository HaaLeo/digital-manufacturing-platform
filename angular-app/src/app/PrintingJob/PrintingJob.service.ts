import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import {
    PrintingJob, Designer, Printer, Enduser, BlueprintMaster, CancelRequest, ConfirmPrintingJob,
    EvaluateReport
} from '../org.usecase.printer';
import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class PrintingJobService {


    private NAMESPACE = 'org.usecase.printer.PrintingJob';
    private DESIGNER = 'org.usecase.printer.Designer';
    private PRINTER = 'org.usecase.printer.Printer';
    private ENDUSER = 'org.usecase.printer.Enduser';
    private BLUEPRINTMASTER = 'org.usecase.printer.BlueprintMaster';
    private CANCELREQUEST = 'org.usecase.printer.CancelRequest';
    private UPDATEREQUEST = 'org.usecase.printer.ConfirmPrintingJob';
    private EVALUATEREPORT = 'org.usecase.printer.EvaluateReport';

    constructor(private dataService: DataService<PrintingJob>, private designerService: DataService<Designer>,
                private confirmPrintingJobService: DataService<ConfirmPrintingJob>,
                private cancelRequestService: DataService<CancelRequest>,
                private blueprintMasterService: DataService<BlueprintMaster>,
                private enduserService: DataService<Enduser>, private printerService: DataService<Printer>,
                private evaluateReportService: DataService<EvaluateReport>) {
    };

    public getAll(): Observable<PrintingJob[]> {
        return this.dataService.getAll(this.NAMESPACE);
    }

    public getAsset(id: any): Observable<PrintingJob> {
      return this.dataService.getSingle(this.NAMESPACE, id);
    }

    public addAsset(itemToAdd: any): Observable<PrintingJob> {
      return this.dataService.add(this.NAMESPACE, itemToAdd);
    }

    public updateAsset(id: any, itemToUpdate: any): Observable<PrintingJob> {
      return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
    }

    public deleteAsset(id: any): Observable<PrintingJob> {
      return this.dataService.delete(this.NAMESPACE, id);
    }

    public cancel(itemToCancel: any): Observable<CancelRequest> {
      return this.cancelRequestService.add(this.CANCELREQUEST, itemToCancel);
    }

    public upload(itemToUpload: any): Observable<ConfirmPrintingJob> {
      return this.confirmPrintingJobService.add(this.UPDATEREQUEST, itemToUpload);
    }

    public getAllPrintingJobs(): Observable<PrintingJob[]> {
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

    public getAllBlueprintMasters(): Observable<BlueprintMaster[]> {
      return this.blueprintMasterService.getAll(this.BLUEPRINTMASTER);
    }

    public getBlueprintMaster(id: any): Observable<BlueprintMaster> {
      return this.blueprintMasterService.getSingle(this.BLUEPRINTMASTER, id);
    }
}
