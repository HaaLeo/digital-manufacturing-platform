import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CustomerService } from './Customer.service';
import 'rxjs/add/operator/toPromise';

@Component({
	selector: 'app-Customer',
	templateUrl: './Customer.component.html',
	styleUrls: ['./Customer.component.css'],
  	providers: [CustomerService]
})
export class CustomerComponent {
  myForm: FormGroup;

  private allCustomers;
  private customer;
  private currentId;
  private errorMessage;
  private progressMessage;
  private successMessage;

  private cash;
  private current_db_id;
  
    stakeholderID = new FormControl("", Validators.required);
    pubKey = new FormControl("", Validators.required);
    firstName = new FormControl("", Validators.required);
    lastName = new FormControl("", Validators.required);
    // TODO add QualityRequirement and Blueprint Master here

  constructor(private serviceCustomer:CustomerService, fb: FormBuilder) {
    this.myForm = fb.group({
          stakeholderID:this.stakeholderID,
          pubKey:this.pubKey,
          firstName:this.firstName,      
          lastName:this.lastName,
        // TODO here as well.
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  resetForm(): void{
    this.myForm.setValue({           
          "stakeholderID":null, 
          "pubKey":null,
          "firstName":null,       
          "lastName":null
        // TODO here to!
      });
  }

  //Update name of Customer
  updateCustomer(form: any): Promise<any> {
    this.progressMessage = 'Please wait... ';
    this.customer = {
      $class: "org.usecase.printer.Customer",
            "pubKey":this.pubKey.value,        
            "firstName":this.firstName.value,          
            "lastName":this.lastName.value,
        // TODO
            // "cash": "resource:org.usecase.printer.Cash#CA_" + form.get("stakeholderID").value,
    };
    return this.serviceCustomer.updateCustomer(form.get("stakeholderID").value,this.customer)
		.toPromise()
		.then(() => {
            this.errorMessage = null;
            this.progressMessage = null;
            this.successMessage = 'Customer updated successfully. Refreshing page...'
            location.reload();
		})
		.catch((error) => {
            if(error == 'Server error'){
              this.progressMessage = null;
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
            else if(error == '404 - Not Found'){
              this.progressMessage = null;
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
        this.progressMessage = null;
				this.errorMessage = error;
			}
    });
  }

  //delete customers and the cash assets associated to it
  deleteCustomer(): Promise<any> {
    this.progressMessage = 'Please wait... ';
    return this.serviceCustomer.deleteCustomer(this.currentId)
		.toPromise()
		.then(() => {
      this.errorMessage = null;
      this.progressMessage = null;
      this.successMessage = 'Customer deleted successfully. Refreshing page...'
      // TODO delete QualityRequirement and blueprint
      // this.serviceCustomer.deleteCash("CA_"+this.currentId)
      //  .toPromise()
      //  .then(() => {
      //      location.reload();
      //  });
		})
		.catch((error) => {
            if(error == 'Server error'){
              this.progressMessage = null;
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if(error == '404 - Not Found'){
        this.progressMessage = null;
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
        this.progressMessage = null;
				this.errorMessage = error;
			}
    });
  }

  setId(id: any): void{
    this.currentId = id;
  }

  getForm(id: any): Promise<any>{
    return this.serviceCustomer.getCustomer(id)
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      let formObject = {        
            "stakeholderID":null,          
            "pubKey":null,  
            "firstName":null,          
            "lastName":null
      };
        if(result.stakeholderID){
          formObject.stakeholderID = result.stakeholderID;
        }else{
          formObject.stakeholderID = null;
        }

        if(result.pubKey){
            formObject.pubKey = result.pubKey;
          }else{
            formObject.pubKey = null;
          }
      
        if(result.firstName){
          formObject.firstName = result.firstName;
        }else{
          formObject.firstName = null;
        }
      
        if(result.lastName){
          formObject.lastName = result.lastName;
        }else{
          formObject.lastName = null;
        }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
        if(error == 'Server error'){
          this.progressMessage = null;
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
          this.progressMessage = null;
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
          this.progressMessage = null;
            this.errorMessage = error;
        }
    });

  }

  // load all Customers and the cash assets associated to them
  loadAll(): Promise<any>  {
    //retrieve all customers
    let customerList = [];
    return this.serviceCustomer.getAllCustomers()
    .toPromise()
    .then((result) => {
        //this.errorMessage = null;
      result.forEach(customer => {
        customerList.push(customer);
      });
    })
    .then(() => {
      this.allCustomers = customerList;
      if (0 < customerList.length) {
        this.current_db_id = customerList[customerList.length - 1].stakeholderID.substr(2)
      } else {
        this.current_db_id = 0
      }
    });
  }

  //add Customer participant
  addCustomer(form: any): Promise<any> {
    this.progressMessage = 'Please wait... ';
    return this.createAssetsCustomer()
      .then(() => {           
        this.errorMessage = null;
        this.progressMessage = null;
        this.successMessage = 'Customer added successfully. Refreshing page...';
        this.myForm.setValue({
            "stakeholderID":null,
            "pubKey":null,
            "firstName":null,
            "lastName":null,
        });
      })
    .catch((error) => {
        if(error == 'Server error'){
          this.progressMessage = null;
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if (error == '500 - Internal Server Error') {
          this.progressMessage = null;
          this.errorMessage = "Input error";
        }
        else{
          this.progressMessage = null;
            this.errorMessage = error;
        }
    });
  }

  //create cash asset associated with the Customer, followed by the Customer
  createAssetsCustomer(): Promise<any> {
    this.current_db_id++;
    this.customer = {
      $class: "org.usecase.printer.Customer",
          "stakeholderID":"D_" + this.current_db_id,
          "pubKey":this.pubKey.value,
          "firstName":this.firstName.value,
          "lastName":this.lastName.value,
      };    
    return this.serviceCustomer.addCustomer(this.customer)
            .toPromise()
            .then(() => {
                location.reload();
            })
        .catch((error) => {
            if(error == 'Server error'){
              this.progressMessage = null;
                this.errorMessage = "Could not connect to REST server. Please check your configuration details";
            }
            else if(error == '404 - Not Found'){
              this.progressMessage = null;
                    this.errorMessage = "404 - Could not find API route. Please check your available APIs."
            }
            else{
              this.progressMessage = null;
                this.errorMessage = error;
            }
        });
  }
}




