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

  //allow update name of Designer
  updateDesigner(form: any): Promise<any> {
    
    console.log("update check");
    this.designer = {
      $class: "org.usecase.printer.Designer",  
            "pubKey":this.pubKey.value,        
            "firstName":this.firstName.value,          
            "lastName":this.lastName.value,
            "contactInformation":this.contactInformation.value,
            "cash": "resource:org.usecase.printer.Cash#CA_" + form.get("stakeholderID").value,
    };
    console.log(this.designer);
    return this.serviceDesigner.updateDesigner(form.get("stakeholderID").value,this.designer)
		.toPromise()
		.then(() => {
            this.errorMessage = null;
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

    return this.serviceDesigner.deleteDesigner(this.currentId)
		.toPromise()
		.then(() => {
      this.errorMessage = null;
      this.serviceDesigner.deleteCash("CA_"+this.currentId)
        .toPromise()
        .then(() => {
            console.log("Deleted")
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


  loadAll_OnlyDesigners(): Promise<any> {
    let tempList = [];
    return this.serviceDesigner.getAllDesigners()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(designer => {
        tempList.push(designer);
      });
      this.allDesigners = tempList;
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
        console.log("in for loop")

        var splitted_cashID = designer.cash.split("#", 2); 
        var cashID = String(splitted_cashID[1]);
        console.log(cashID);
        this.serviceDesigner.getCash(cashID)
        .toPromise()
        .then((result) => {
          this.errorMessage = null;
          if(result.value){
            designer.cashValue = result.value;
          }
          if(result.currency){
            designer.cashCurrency = result.currency;
          }
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

    return this.createAssetsDesigner()
      .then(() => {           
        this.errorMessage = null;
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
            console.log("create designer");            
            this.serviceDesigner.addDesigner(this.designer)
            .toPromise()
            .then(() => {
                console.log("created asset");
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




