import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CashService } from './Cash.service';
import 'rxjs/add/operator/toPromise';
@Component({
	selector: 'app-Cash',
	templateUrl: './Cash.component.html',
	styleUrls: ['./Cash.component.css'],
  providers: [CashService]
})
export class CashComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
	private errorMessage;

  
      
          cashID = new FormControl("", Validators.required);
        
  
      
          currency = new FormControl("", Validators.required);
        
  
      
          value = new FormControl("", Validators.required);
        
  
      
          ownerID = new FormControl("", Validators.required);
        
  
      
          ownerEntity = new FormControl("", Validators.required);
        
  


  constructor(private serviceCash:CashService, fb: FormBuilder) {
    this.myForm = fb.group({
    
        
          cashID:this.cashID,
        
    
        
          currency:this.currency,
        
    
        
          value:this.value,
        
    
        
          ownerID:this.ownerID,
        
    
        
          ownerEntity:this.ownerEntity
        
    
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    let tempList = [];
    return this.serviceCash.getAll()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
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

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: "org.usecase.printer.Cash",
      
        
          "cashID":this.cashID.value,
        
      
        
          "currency":this.currency.value,
        
      
        
          "value":this.value.value,
        
      
        
          "ownerID":this.ownerID.value,
        
      
        
          "ownerEntity":this.ownerEntity.value
        
      
    };

    this.myForm.setValue({
      
        
          "cashID":null,
        
      
        
          "currency":null,
        
      
        
          "value":null,
        
      
        
          "ownerID":null,
        
      
        
          "ownerEntity":null
        
      
    });

    return this.serviceCash.addAsset(this.asset)
    .toPromise()
    .then(() => {
			this.errorMessage = null;
      this.myForm.setValue({
          "cashID":null,
          "currency":null,
          "value":null,
          "ownerID":null,
          "ownerEntity":null 
      });
      location.reload();
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else{
            this.errorMessage = error;
        }
    });
  }


   updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: "org.usecase.printer.Cash",
            "currency":this.currency.value,
            "value":this.value.value,
            "ownerID":this.ownerID.value,
            "ownerEntity":this.ownerEntity.value
    };

    return this.serviceCash.updateAsset(form.get("cashID").value,this.asset)
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


  deleteAsset(): Promise<any> {

    return this.serviceCash.deleteAsset(this.currentId)
		.toPromise()
		.then(() => {
      this.errorMessage = null;
      console.log("Cash deleted");
      location.reload();
      // var ownerID = this.currentId.split("_")[1];

      // if(this.ownerEntity.value == "Designer") {
      //   this.serviceCash.deleteDesigner(ownerID)
      //     .toPromise() 
      //     .then(() => {
      //       console.log("Cash owner deleted");
      //       location.reload();

      //     });  
      // } else if(this.ownerEntity.value == "Enduser") {
      //   console.log("DELETING ENDUSER");
      //   this.serviceCash.deleteEnduser(ownerID)
      //   .toPromise() 
      //   .then(() => {
      //     console.log("Cash owner deleted");
      //     location.reload();

      //   });  
      // }      
      
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

    return this.serviceCash.getAsset(id)
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      let formObject = {
        "cashID":null,
        "currency":null,
        "value":null,
        "ownerID":null,
        "ownerEntity":null    
      };
        if(result.cashID){  
            formObject.cashID = result.cashID;
        }else{
          formObject.cashID = null;
        }

        if(result.currency){          
            formObject.currency = result.currency;
        }else{
          formObject.currency = null;
        }
      
        //ALLOW 0 value to be displayed
        // if(result.value){
          
            formObject.value = result.value;
          
        // }else{
        //   formObject.value = null;
        // }
      
        if(result.ownerID){
          
            formObject.ownerID = result.ownerID;
          
        }else{
          formObject.ownerID = null;
        }
      
        if(result.ownerEntity){
          
            formObject.ownerEntity = result.ownerEntity;
          
        }else{
          formObject.ownerEntity = null;
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

  resetForm(): void{
    this.myForm.setValue({
      
        
          "cashID":null,
        
      
        
          "currency":null,
        
      
        
          "value":null,
        
      
        
          "ownerID":null,
        
      
        
          "ownerEntity":null 
        
      
      });
  }

}
