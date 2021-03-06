import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { Printer } from '../org.usecase.printer';


import { BlueprintMaster } from '../org.usecase.printer';
import { PrintingJob } from '../org.usecase.printer';
import { Cash } from '../org.usecase.printer';


import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class PrinterService {

	
	private PRINTER: string = 'org.usecase.printer.Printer';  
	
    constructor(private printerService: DataService<Printer>, private cashService: DataService<Cash>) {
    };

    //Printer functions
    public getAllPrinters(): Observable<Printer[]> {
        return this.printerService.getAll(this.PRINTER);
    }

    public getPrinter(id: any): Observable<Printer> {
      return this.printerService.getSingle(this.PRINTER, id);
    }

    public addPrinter(itemToAdd: any): Observable<Printer> {
      return this.printerService.add(this.PRINTER, itemToAdd);
    }

    public deletePrinter(id: any): Observable<Printer> {
      return this.printerService.delete(this.PRINTER, id);
    }

    public updatePrinter(id: any, itemToUpdate: any): Observable<Printer> {
      return this.printerService.update(this.PRINTER, id, itemToUpdate);
    }

}