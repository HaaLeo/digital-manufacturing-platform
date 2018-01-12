import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BlueprintCopyService } from './BlueprintCopy.service';
import 'rxjs/add/operator/toPromise';
@Component({
	selector: 'app-BlueprintCopy',
	templateUrl: './BlueprintCopy.component.html',
	styleUrls: ['./BlueprintCopy.component.css'],
  providers: [BlueprintCopyService]
})
export class BlueprintCopyComponent implements OnInit {

  myForm: FormGroup;

  private allBlueprintCopyAssets;
  private asset;
  private currentId;
	private errorMessage;

  
      
          blueprintCopyID = new FormControl("", Validators.required);
        
  
      
          printed = new FormControl("", Validators.required);
        
  
      
          OTPencryptedWithDesignerPubKey = new FormControl("", Validators.required);
        
  
      
          OTPencryptedWithPrinterPubKey = new FormControl("", Validators.required);
        
  
      
          printer = new FormControl("", Validators.required);
        
  
      
          buyer = new FormControl("", Validators.required);
        
  
      
          blueprintMaster = new FormControl("", Validators.required);
        
  
      
          owner = new FormControl("", Validators.required);
        
  


  constructor(private serviceBlueprintCopy:BlueprintCopyService, fb: FormBuilder) {
    this.myForm = fb.group({
    
        
          blueprintCopyID:this.blueprintCopyID,
        
    
        
          printed:this.printed,
        
    
        
          OTPencryptedWithDesignerPubKey:this.OTPencryptedWithDesignerPubKey,
        
    
        
          OTPencryptedWithPrinterPubKey:this.OTPencryptedWithPrinterPubKey,
        
    
        
          printer:this.printer,
        
    
        
          buyer:this.buyer,
        
    
        
          blueprintMaster:this.blueprintMaster,
        
    
        
          owner:this.owner
        
    
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    let tempList = [];
    return this.serviceBlueprintCopy.getAll()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allBlueprintCopyAssets = tempList;
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
      $class: "org.usecase.printer.BlueprintCopy",
      
        
          "blueprintCopyID":this.blueprintCopyID.value,
        
      
        
          "printed":this.printed.value,
        
      
        
          "OTPencryptedWithDesignerPubKey":this.OTPencryptedWithDesignerPubKey.value,
        
      
        
          "OTPencryptedWithPrinterPubKey":this.OTPencryptedWithPrinterPubKey.value,
        
      
        
          "printer":this.printer.value,
        
      
        
          "buyer":this.buyer.value,
        
      
        
          "blueprintMaster":this.blueprintMaster.value,
        
      
        
          "owner":this.owner.value
        
      
    };

    this.myForm.setValue({
      
        
          "blueprintCopyID":null,
        
      
        
          "printed":null,
        
      
        
          "OTPencryptedWithDesignerPubKey":null,
        
      
        
          "OTPencryptedWithPrinterPubKey":null,
        
      
        
          "printer":null,
        
      
        
          "buyer":null,
        
      
        
          "blueprintMaster":null,
        
      
        
          "owner":null
        
      
    });

    return this.serviceBlueprintCopy.addAsset(this.asset)
    .toPromise()
    .then(() => {
			this.errorMessage = null;
      this.myForm.setValue({
      
        
          "blueprintCopyID":null,
        
      
        
          "printed":null,
        
      
        
          "OTPencryptedWithDesignerPubKey":null,
        
      
        
          "OTPencryptedWithPrinterPubKey":null,
        
      
        
          "printer":null,
        
      
        
          "buyer":null,
        
      
        
          "blueprintMaster":null,
        
      
        
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
      $class: "org.usecase.printer.BlueprintCopy",
      
        
          
        
    
        
          
            "printed":this.printed.value,
          
        
    
        
          
            "OTPencryptedWithDesignerPubKey":this.OTPencryptedWithDesignerPubKey.value,
          
        
    
        
          
            "OTPencryptedWithPrinterPubKey":this.OTPencryptedWithPrinterPubKey.value,
          
        
    
        
          
            "printer":this.printer.value,
          
        
    
        
          
            "buyer":this.buyer.value,
          
        
    
        
          
            "blueprintMaster":this.blueprintMaster.value,
          
        
    
        
          
            "owner":this.owner.value
          
        
    
    };

    return this.serviceBlueprintCopy.updateAsset(form.get("blueprintCopyID").value,this.asset)
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

    return this.serviceBlueprintCopy.deleteAsset(this.currentId)
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

    return this.serviceBlueprintCopy.getAsset(id)
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      let formObject = {
        
          
            "blueprintCopyID":null,
          
        
          
            "printed":null,
          
        
          
            "OTPencryptedWithDesignerPubKey":null,
          
        
          
            "OTPencryptedWithPrinterPubKey":null,
          
        
          
            "printer":null,
          
        
          
            "buyer":null,
          
        
          
            "blueprintMaster":null,
          
        
          
            "owner":null 
          
        
      };



      
        if(result.blueprintCopyID){
          
            formObject.blueprintCopyID = result.blueprintCopyID;
          
        }else{
          formObject.blueprintCopyID = null;
        }
      
        if(result.printed){
          
            formObject.printed = result.printed;
          
        }else{
          formObject.printed = null;
        }
      
        if(result.OTPencryptedWithDesignerPubKey){
          
            formObject.OTPencryptedWithDesignerPubKey = result.OTPencryptedWithDesignerPubKey;
          
        }else{
          formObject.OTPencryptedWithDesignerPubKey = null;
        }
      
        if(result.OTPencryptedWithPrinterPubKey){
          
            formObject.OTPencryptedWithPrinterPubKey = result.OTPencryptedWithPrinterPubKey;
          
        }else{
          formObject.OTPencryptedWithPrinterPubKey = null;
        }
      
        if(result.printer){
          
            formObject.printer = result.printer;
          
        }else{
          formObject.printer = null;
        }
      
        if(result.buyer){
          
            formObject.buyer = result.buyer;
          
        }else{
          formObject.buyer = null;
        }
      
        if(result.blueprintMaster){
          
            formObject.blueprintMaster = result.blueprintMaster;
          
        }else{
          formObject.blueprintMaster = null;
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
      
        
          "blueprintCopyID":null,
        
      
        
          "printed":null,
        
      
        
          "OTPencryptedWithDesignerPubKey":null,
        
      
        
          "OTPencryptedWithPrinterPubKey":null,
        
      
        
          "printer":null,
        
      
        
          "buyer":null,
        
      
        
          "blueprintMaster":null,
        
      
        
          "owner":null 
        
      
      });
  }

}
