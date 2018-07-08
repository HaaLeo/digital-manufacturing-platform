import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import {BlueprintMaster, EvaluationResult} from '../org.usecase.printer';
import 'rxjs/Rx';

import { Designer, Enduser, Printer, RequestBlueprint, CancelRequest} from 'app/org.usecase.printer';

// Can be injected into a constructor
@Injectable()
export class EvaluationResultService {

    private NAMESPACE: string = 'org.usecase.printer.EvaluationResult';
    private DESIGNER: string = 'org.usecase.printer.Designer';
    private PRINTER: string = 'org.usecase.printer.Printer';
    private ENDUSER: string = 'org.usecase.printer.Enduser';

    constructor(private dataService: DataService<EvaluationResult>,
                private designerService: DataService<Designer>,
                private enduserService: DataService<Enduser>,
                private printerService: DataService<Printer>) {
    };

    public getAll(): Observable<EvaluationResult[]> {
        return this.dataService.getAll(this.NAMESPACE);
    }

    public getAsset(id: any): Observable<EvaluationResult> {
        return this.dataService.getSingle(this.NAMESPACE, id);
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
}
