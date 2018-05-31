import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { QualityRequirement } from '../org.usecase.printer';
import 'rxjs/Rx';

import { Customer, Enduser, Printer, RequestBlueprint, CancelRequest} from 'app/org.usecase.printer';

// Can be injected into a constructor
@Injectable()
export class QualityRequirementService {

	
		private NAMESPACE: string = 'org.usecase.printer.QualityRequirement';
    private CUSTOMER: string = 'org.usecase.printer.Customer';
    private PRINTER: string = 'org.usecase.printer.Printer';
    private ENDUSER: string = 'org.usecase.printer.Enduser';
    private REQUESTBLUEPRINT: string = 'org.usecase.printer.RequestBlueprint';

    constructor(private dataService: DataService<QualityRequirement>,
                private customerService: DataService<Customer>,
                private enduserService: DataService<Enduser>, 
                private printerService: DataService<Printer>, 
                private requestBlueprintService: DataService<RequestBlueprint>) {
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

    public getAllCustomers(): Observable<Customer[]> {
      return this.customerService.getAll(this.CUSTOMER);
  }

  public getCustomer(id: any): Observable<Customer> {
    return this.customerService.getSingle(this.CUSTOMER, id);
  }

  public getAllEndusers(): Observable<Enduser[]> {
    return this.enduserService.getAll(this.ENDUSER);
}

public getAllPrinters(): Observable<Printer[]> {
  return this.printerService.getAll(this.PRINTER);
}

//create requestBlueprint transaction
public requestBlueprint(itemToAdd: any): Observable<RequestBlueprint> {
  return this.requestBlueprintService.add(this.REQUESTBLUEPRINT, itemToAdd);
}

}
