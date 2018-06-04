import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { Customer } from '../org.usecase.printer';


import { QualityRequirement } from '../org.usecase.printer';

import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class CustomerService {

	
	private CUSTOMER: string = 'org.usecase.printer.Customer';

    constructor(private customerService: DataService<Customer>) {
    };

    //Customer functions
    public getAllCustomers(): Observable<Customer[]> {
        return this.customerService.getAll(this.CUSTOMER);
    }

    public getCustomer(id: any): Observable<Customer> {
      return this.customerService.getSingle(this.CUSTOMER, id);
    }

    public addCustomer(itemToAdd: any): Observable<Customer> {
      return this.customerService.add(this.CUSTOMER, itemToAdd);
    }

    public deleteCustomer(id: any): Observable<Customer> {
      return this.customerService.delete(this.CUSTOMER, id);
    }

    public updateCustomer(id: any, itemToUpdate: any): Observable<Customer> {
      return this.customerService.update(this.CUSTOMER, id, itemToUpdate);
    }
}