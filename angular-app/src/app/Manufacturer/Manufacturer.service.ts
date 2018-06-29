import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { Manufacturer } from '../org.usecase.printer';

import { Cash } from '../org.usecase.printer';


import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class ManufacturerService {


	private MANUFACTURER: string = 'org.usecase.printer.Manufacturer';

    constructor(private manufacturerService: DataService<Manufacturer>, private cashService: DataService<Cash>) {
    };

    //Manufacturer functions
    public getAllManufacturers(): Observable<Manufacturer[]> {
        return this.manufacturerService.getAll(this.MANUFACTURER);
    }

    public getManufacturer(id: any): Observable<Manufacturer> {
      return this.manufacturerService.getSingle(this.MANUFACTURER, id);
    }

    public addManufacturer(itemToAdd: any): Observable<Manufacturer> {
      return this.manufacturerService.add(this.MANUFACTURER, itemToAdd);
    }

    public deleteManufacturer(id: any): Observable<Manufacturer> {
      return this.manufacturerService.delete(this.MANUFACTURER, id);
    }

    public updateManufacturer(id: any, itemToUpdate: any): Observable<Manufacturer> {
      return this.manufacturerService.update(this.MANUFACTURER, id, itemToUpdate);
    }

}
