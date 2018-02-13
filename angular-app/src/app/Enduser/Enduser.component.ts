import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { EnduserService } from './Enduser.service';
import 'rxjs/add/operator/toPromise';

@Component({
	selector: 'app-Enduser',
	templateUrl: './Enduser.component.html',
	styleUrls: ['./Enduser.component.css'],
  	providers: [EnduserService]
})
export class EnduserComponent {
  myForm: FormGroup;

  private allEndusers;
  private enduser;
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
  contactInformation = new FormControl("", Validators.required);
  cashValue = new FormControl("", Validators.required);
  cashCurrency = new FormControl("", Validators.required);

  constructor(private serviceEnduser:EnduserService, fb: FormBuilder) {
    this.myForm = fb.group({
          stakeholderID:this.stakeholderID,
          pubKey:this.pubKey,
          firstName:this.firstName,      
          lastName:this.lastName,
          contactInformation:this.contactInformation,
          cashValue:this.cashValue,
          cashCurrency:this.cashCurrency
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
          "lastName":null,
          "contactInformation":null,
          "cashValue":null,
          "cashCurrency":null
      });
  }

  //allow update name of Enduser
  updateEnduser(form: any): Promise<any> {
    this.progressMessage = 'Please wait... ';
    this.enduser = {
      $class: "org.usecase.printer.Enduser",  
            "pubKey":this.pubKey.value,        
            "firstName":this.firstName.value,          
            "lastName":this.lastName.value,
            "contactInformation":this.contactInformation.value,
            "cash": "resource:org.usecase.printer.Cash#CA_" + form.get("stakeholderID").value,
    };
    return this.serviceEnduser.updateEnduser(form.get("stakeholderID").value,this.enduser)
		.toPromise()
		.then(() => {
            this.errorMessage = null;
            this.progressMessage = null;
            this.successMessage = 'User updated successfully. Refreshing page...'
            location.reload();
		})
		.catch((error) => {
            if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
            else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
				this.errorMessage = error;
			}
    });
  }

  //delete Endusers and the cash assets associated to it
  deleteEnduser(): Promise<any> {
    this.progressMessage = 'Please wait... ';
    return this.serviceEnduser.deleteEnduser(this.currentId)
		.toPromise()
		.then(() => {
			this.errorMessage = null;
      this.progressMessage = null;
      this.successMessage = 'User deleted successfully. Refreshing page...'
      this.serviceEnduser.deleteCash("CA_"+this.currentId)
              .toPromise()
              .then(() => {
                  location.reload();
              });            
		})
		.catch((error) => {
            if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
				this.errorMessage = error;
			}
    });
  }

  setId(id: any): void{
    this.currentId = id;
  }

  getForm(id: any): Promise<any>{
    return this.serviceEnduser.getEnduser(id)
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      let formObject = {        
            "stakeholderID":null,          
            "pubKey":null,  
            "firstName":null,          
            "lastName":null,
            "contactInformation":null,               
            "cashValue":null, 
            "cashCurrency":null      
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

        if(result.contactInformation){
            formObject.contactInformation = result.contactInformation;
          }else{
            formObject.contactInformation = null;
          }  
      this.myForm.setValue(formObject);
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });

  }

  //load all Endusers and the cash assets associated to them 
  loadAll(): Promise<any>  {
    //retrieve all endusers
    let enduserList = [];
    return this.serviceEnduser.getAllEndusers()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(enduser => {
        enduserList.push(enduser);
      });     
    })
    .then(() => {
      for (let enduser of enduserList) {
        var splitted_cashID = enduser.cash.split("#", 2); 
        var cashID = String(splitted_cashID[1]);
        this.serviceEnduser.getCash(cashID)
        .toPromise()
        .then((result) => {
          this.errorMessage = null;
          enduser.cashValue = result.value;
          enduser.cashCurrency = result.currency;
        });
      }
      this.allEndusers = enduserList;
      if (0 < enduserList.length) {
        this.current_db_id = enduserList[enduserList.length - 1].stakeholderID.substr(3)
      } else {
        this.current_db_id = 0
      }
    });

  }

  //add Enduser participant
  addEnduser(form: any): Promise<any> {
    this.progressMessage = 'Please wait... ';
    return this.createAssetsEnduser()
      .then(() => {           
        this.errorMessage = null;
        this.progressMessage = null;
        this.successMessage = 'User added successfully. Refreshing page...';
        this.myForm.setValue({
            "stakeholderID":null,
            "pubKey":null,
            "firstName":null,
            "lastName":null,
            "contactInformation":null,
            "cashValue":null,
            "cashCurrency":null
        });
      })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if (error == '500 - Internal Server Error') {
          this.errorMessage = "Input error";
        }
        else{
            this.errorMessage = error;
        }
    });
  }

  //create cash asset associated with the Enduser, followed by the Enduser
  createAssetsEnduser(): Promise<any> {
    this.current_db_id++;
    this.cash = {
      $class: "org.usecase.printer.Cash",
          "cashID":"CA_EU_" + this.current_db_id,
          "currency":this.cashCurrency.value,
          "value":this.cashValue.value,
          "ownerID":"EU_" + this.current_db_id,
          "ownerEntity":'Enduser'        
    };    
    this.enduser = {
      $class: "org.usecase.printer.Enduser",
          "stakeholderID":"EU_" + this.current_db_id,
          "pubKey":this.pubKey.value,
          "firstName":this.firstName.value,
          "lastName":this.lastName.value,
          "contactInformation":this.contactInformation.value,
          "cash":"CA_EU_" + this.current_db_id
      };    
    return this.serviceEnduser.addCash(this.cash)
        .toPromise()
        .then(() => {
            this.serviceEnduser.addEnduser(this.enduser)
            .toPromise()
            .then(() => {
                location.reload();
            });         
		});
  }
}




