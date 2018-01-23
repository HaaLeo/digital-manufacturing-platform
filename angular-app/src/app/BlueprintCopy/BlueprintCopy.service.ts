import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { BlueprintCopy } from '../org.usecase.printer';
import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class BlueprintCopyService {

	
		private NAMESPACE: string = 'org.usecase.printer.BlueprintCopy';
	



    constructor(private dataService: DataService<BlueprintCopy>) {
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
}
