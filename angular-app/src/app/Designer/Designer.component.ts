import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DesignerService } from './Designer.service';
import 'rxjs/add/operator/toPromise';

@Component({
	selector: 'app-Designer',
	templateUrl: './Designer.component.html',
	styleUrls: ['./Designer.component.css'],
  	providers: [DesignerService]
})
export class DesignerComponent {
  myForm: FormGroup;

  private allDesigners;
  private designer;
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

  constructor(private serviceDesigner:DesignerService, fb: FormBuilder) {
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

  //Update name of Designer
  updateDesigner(form: any): Promise<any> {
    this.progressMessage = 'Please wait... ';
    this.designer = {
      $class: "org.usecase.printer.Designer",  
            "pubKey":this.pubKey.value,        
            "firstName":this.firstName.value,          
            "lastName":this.lastName.value,
            "contactInformation":this.contactInformation.value,
            "cash": "resource:org.usecase.printer.Cash#CA_" + form.get("stakeholderID").value,
    };
    return this.serviceDesigner.updateDesigner(form.get("stakeholderID").value,this.designer)
		.toPromise()
		.then(() => {
            this.errorMessage = null;
            this.progressMessage = null;
            this.successMessage = 'Designer updated successfully. Refreshing page...'
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

  //delete designers and the cash assets associated to it
  deleteDesigner(): Promise<any> {
    this.progressMessage = 'Please wait... ';
    return this.serviceDesigner.deleteDesigner(this.currentId)
		.toPromise()
		.then(() => {
      this.errorMessage = null;
      this.progressMessage = null;
      this.successMessage = 'Designer deleted successfully. Refreshing page...'
      this.serviceDesigner.deleteCash("CA_"+this.currentId)
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
    return this.serviceDesigner.getDesigner(id)
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

  //load all Designers and the cash assets associated to them 
  loadAll(): Promise<any>  {
    //retrieve all designers
    let designerList = [];
    return this.serviceDesigner.getAllDesigners()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(designer => {
        designerList.push(designer);
      });     
    })
    .then(() => {
      for (let designer of designerList) {
        var splitted_cashID = designer.cash.split("#", 2); 
        var cashID = String(splitted_cashID[1]);
        this.serviceDesigner.getCash(cashID)
        .toPromise()
        .then((result) => {
          this.errorMessage = null;
          designer.cashValue = result.value;
          designer.cashCurrency = result.currency;
        });
      }
      this.allDesigners = designerList;
      if (0 < designerList.length) {
        this.current_db_id = designerList[designerList.length - 1].stakeholderID.substr(2)
      } else {
        this.current_db_id = 0
      }
    });
  }

  //add Designer participant
  addDesigner(form: any): Promise<any> {
    this.progressMessage = 'Please wait... ';
    return this.createAssetsDesigner()
      .then(() => {           
        this.errorMessage = null;
        this.progressMessage = null;
        this.successMessage = 'Designer added successfully. Refreshing page...';
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

  //create cash asset associated with the Designer, followed by the Designer
  createAssetsDesigner(): Promise<any> {
    this.current_db_id++;
    this.cash = {
      $class: "org.usecase.printer.Cash",
          "cashID":"CA_D_" + this.current_db_id,
          "currency":this.cashCurrency.value,
          "value":this.cashValue.value,
          "ownerID":"D_" + this.current_db_id,
          "ownerEntity":'Designer'        
    };    
    this.designer = {
      $class: "org.usecase.printer.Designer",
          "stakeholderID":"D_" + this.current_db_id,
          "pubKey":this.pubKey.value,
          "firstName":this.firstName.value,
          "lastName":this.lastName.value,
          "contactInformation":this.contactInformation.value,
          "cash":"CA_D_" + this.current_db_id
      };    
    return this.serviceDesigner.addCash(this.cash)
        .toPromise()
        .then(() => {
            this.serviceDesigner.addDesigner(this.designer)
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
}




