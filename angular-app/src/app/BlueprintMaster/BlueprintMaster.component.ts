import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BlueprintMasterService } from './BlueprintMaster.service';
import 'rxjs/add/operator/toPromise';
@Component({
	selector: 'app-BlueprintMaster',
	templateUrl: './BlueprintMaster.component.html',
	styleUrls: ['./BlueprintMaster.component.css'],
  providers: [BlueprintMasterService]
})
export class BlueprintMasterComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
	private errorMessage;

  
      
          blueprintMasterID = new FormControl("", Validators.required);
        
  
      
          assetHash = new FormControl("", Validators.required);
        
  
      
          price = new FormControl("", Validators.required);
        
  
      
          metadata = new FormControl("", Validators.required);
        
  
      
          owner = new FormControl("", Validators.required);
        
  


  constructor(private serviceBlueprintMaster:BlueprintMasterService, fb: FormBuilder) {
    this.myForm = fb.group({
    
        
          blueprintMasterID:this.blueprintMasterID,
        
    
        
          assetHash:this.assetHash,
        
    
        
          price:this.price,
        
    
        
          metadata:this.metadata,
        
    
        
          owner:this.owner
        
    
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    let tempList = [];
    return this.serviceBlueprintMaster.getAll()
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
      $class: "org.usecase.printer.BlueprintMaster",
      
        
          "blueprintMasterID":this.blueprintMasterID.value,
        
      
        
          "assetHash":this.assetHash.value,
        
      
        
          "price":this.price.value,
        
      
        
          "metadata":this.metadata.value,
        
      
        
          "owner":this.owner.value
        
      
    };

    this.myForm.setValue({
      
        
          "blueprintMasterID":null,
        
      
        
          "assetHash":null,
        
      
        
          "price":null,
        
      
        
          "metadata":null,
        
      
        
          "owner":null
        
      
    });

    return this.serviceBlueprintMaster.addAsset(this.asset)
    .toPromise()
    .then(() => {
			this.errorMessage = null;
      this.myForm.setValue({
      
        
          "blueprintMasterID":null,
        
      
        
          "assetHash":null,
        
      
        
          "price":null,
        
      
        
          "metadata":null,
        
      
        
          "owner":null 
        
      
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
      $class: "org.usecase.printer.BlueprintMaster",
      
        
          
        
    
        
          
            "assetHash":this.assetHash.value,
          
        
    
        
          
            "price":this.price.value,
          
        
    
        
          
            "metadata":this.metadata.value,
          
        
    
        
          
            "owner":this.owner.value
          
        
    
    };

    return this.serviceBlueprintMaster.updateAsset(form.get("blueprintMasterID").value,this.asset)
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

    return this.serviceBlueprintMaster.deleteAsset(this.currentId)
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

  setId(id: any): void{
    this.currentId = id;
  }

  getForm(id: any): Promise<any>{

    return this.serviceBlueprintMaster.getAsset(id)
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      let formObject = {
        
          
            "blueprintMasterID":null,
          
        
          
            "assetHash":null,
          
        
          
            "price":null,
          
        
          
            "metadata":null,
          
        
          
            "owner":null 
          
        
      };



      
        if(result.blueprintMasterID){
          
            formObject.blueprintMasterID = result.blueprintMasterID;
          
        }else{
          formObject.blueprintMasterID = null;
        }
      
        if(result.assetHash){
          
            formObject.assetHash = result.assetHash;
          
        }else{
          formObject.assetHash = null;
        }
      
        if(result.price){
          
            formObject.price = result.price;
          
        }else{
          formObject.price = null;
        }
      
        if(result.metadata){
          
            formObject.metadata = result.metadata;
          
        }else{
          formObject.metadata = null;
        }
      
        if(result.owner){
          
            formObject.owner = result.owner;
          
        }else{
          formObject.owner = null;
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
      
        
          "blueprintMasterID":null,
        
      
        
          "assetHash":null,
        
      
        
          "price":null,
        
      
        
          "metadata":null,
        
      
        
          "owner":null 
        
      
      });
  }

}
