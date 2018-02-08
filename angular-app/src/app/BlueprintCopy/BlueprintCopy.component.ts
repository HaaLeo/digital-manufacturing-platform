import { Component, OnInit, Input, NgModule, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BlueprintCopyService } from './BlueprintCopy.service';
import 'rxjs/add/operator/toPromise';
import { UsersPipe} from './Pipe';
import {FileuploadComponent} from "../fileupload/fileupload.component"


@Component({
	selector: 'app-BlueprintCopy',
	templateUrl: './BlueprintCopy.component.html',
	styleUrls: ['./BlueprintCopy.component.css'],
  providers: [BlueprintCopyService]
})

export class BlueprintCopyComponent implements OnInit {

  @ViewChild(FileuploadComponent)
  private fileUploadComponent: FileuploadComponent;

  myForm: FormGroup;

  private allBlueprintCopyAssets;
  private allEndusers;
  private allPrinters;
  private allDesigners;
  private allBlueprintMasters;
  private allStakeholders = [];

  private asset;
  private currentId;
	private errorMessage;
  private cancelRequestObj;
  private allBlueprintCopies;
  private blueprintCopyCurrent;
  private filterID;
  private selectedElement;
  
  blueprintCopyID = new FormControl("", Validators.required);

  printed = new FormControl("", Validators.required);

  otpEncryptedWithDesignerPubKey = new FormControl("", Validators.required);

  otpEncryptedWithPrinterPubKey = new FormControl("", Validators.required);

  printer = new FormControl("", Validators.required);

  buyer = new FormControl("", Validators.required);

  blueprintMaster = new FormControl("", Validators.required);

  owner = new FormControl("", Validators.required);
        
  
  constructor(private serviceBlueprintCopy:BlueprintCopyService, fb: FormBuilder) {
    this.myForm = fb.group({
    
          blueprintCopyID:this.blueprintCopyID,
          printed:this.printed,
          otpEncryptedWithDesignerPubKey:this.otpEncryptedWithDesignerPubKey,
          otpEncryptedWithPrinterPubKey:this.otpEncryptedWithPrinterPubKey,
          printer:this.printer,
          buyer:this.buyer,
          blueprintMaster:this.blueprintMaster,
          owner:this.owner
    });
  };

  ngOnInit(): void {
    this.loadAllx().then(() => {                     
      this.load_OnlyDesigners();
    }).then(() => {                     
      this.load_OnlyEndusers();
    }).then(() => {                     
      this.load_OnlyPrinters();
    }).then(() => {                     
      this.load_allStakeholder();
    });    
    this.selectedElement = "all"
  }

  filter(asset: string): boolean {
    return true;
  }
  
  transform(records: Array<any>, property:any): any {
    let sortedArray=[];
    if(property){
    console.log(sortedArray);
    return sortedArray
    }
}

  // Load all BlueprintCopy assets
  loadAll(): Promise<any> {
    let tempList = [];
    return this.serviceBlueprintCopy.getAll()
    .toPromise()

    .then((result) => {
			this.errorMessage = null;
      result.forEach(asset => {

        var bpMasterOwnerID;
      //get blueprintMaster
      for (let blueprintMaster of this.allBlueprintMasters) {
        if(blueprintMaster.blueprintMasterID === this.serviceBlueprintCopy.getID(asset.blueprintMaster)){
          bpMasterOwnerID = blueprintMaster.owner.stakeholderID;
        }     
      };

      let tempAsset = {
      $class: "org.usecase.printer.BlueprintCopy",
          "blueprintCopyID":asset.blueprintCopyID,
        
          "printed":asset.printed,
        
          "otpEncryptedWithDesignerPubKey": asset.otpEncryptedWithDesignerPubKey,
        
          "otpEncryptedWithPrinterPubKey": asset.otpEncryptedWithPrinterPubKey,
        
          "printer":this.serviceBlueprintCopy.getID(asset.printer),
        
          "buyer":this.serviceBlueprintCopy.getID(asset.buyer),
        
          "blueprintMaster":this.serviceBlueprintCopy.getID(asset.blueprintMaster),

          "designer": this.serviceBlueprintCopy.getID(asset.owner),
        
          "owner":this.serviceBlueprintCopy.getID(asset.owner)
      
        };
        
        tempList.push(tempAsset);
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

   //load all BlueprintCopy assets and Master associated to it
   loadAllx(): Promise<any>  {
    
    //retrieve all designers
    let bpcList = [];
    return this.serviceBlueprintCopy.getAll()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(bpc => {
        bpc.buyer = this.serviceBlueprintCopy.getID(bpc.buyer)
        bpc.printer = this.serviceBlueprintCopy.getID(bpc.printer)
        bpc.blueprintMaster = this.serviceBlueprintCopy.getID(bpc.blueprintMaster)
        bpc.owner = this.serviceBlueprintCopy.getID(bpc.owner)
        bpcList.push(bpc);
      });     
    })
    .then(() => {

      for (let bpc of bpcList) {
        this.serviceBlueprintCopy.getBlueprintMaster(bpc.blueprintMaster)
        .toPromise()
        .then((result) => {
          this.errorMessage = null;
          if(result.owner){
            bpc.designer = this.serviceBlueprintCopy.getID(result.owner);
          }
        });
      }

      this.allBlueprintCopyAssets = bpcList;
    });

  }

  //get all printers
	load_allStakeholder(): Promise<any> {
		let tempList = [];
		return this.serviceBlueprintCopy.getAllDesigners()
		.toPromise()
		.then((result) => {
				this.errorMessage = null;
		result.forEach(designer => {
      tempList.push(designer);
		});
    })
    .then(() => {
      this.serviceBlueprintCopy.getAllPrinters()
      .toPromise()
      .then((result) => {
          this.errorMessage = null;
      result.forEach(printer => {
        tempList.push(printer);
      });
      })
    })
    .then(() => {
      this.serviceBlueprintCopy.getAllEndusers()
      .toPromise()
      .then((result) => {
          this.errorMessage = null;
      result.forEach(enduser => {
        tempList.push(enduser);
      });
      this.allStakeholders = tempList;
      })
    })
    
		;
  }

  //get all printers
	load_OnlyPrinters(): Promise<any> {
		let tempList = [];
		return this.serviceBlueprintCopy.getAllPrinters()
		.toPromise()
		.then((result) => {
				this.errorMessage = null;
		result.forEach(printer => {
      tempList.push(printer);
		});
    this.allPrinters = tempList;
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
  //get all endusers
	load_OnlyEndusers(): Promise<any> {
		let tempList = [];
		return this.serviceBlueprintCopy.getAllEndusers()
		.toPromise()
		.then((result) => {
				this.errorMessage = null;
		result.forEach(enduser => {
      tempList.push(enduser);
		});
		this.allEndusers = tempList;
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

  //load all Designers 
  load_OnlyDesigners(): Promise<any>  {
    
    //retrieve all designers
    let designerList = [];
    return this.serviceBlueprintCopy.getAllDesigners()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(designer => {
        designerList.push(designer);
      });    
      this.allDesigners = designerList;
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

  //load all BlueprintMaster assets 
  load_OnlyBlueprintMasters(): Promise<any>  {
    
    //retrieve all designers
    let blueprintMastersList = [];
    return this.serviceBlueprintCopy.getAllBlueprintMasters()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(bpm => {
        blueprintMastersList.push(bpm);
      });    
      this.allBlueprintMasters = blueprintMastersList;
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
        
          "otpEncryptedWithDesignerPubKey":this.otpEncryptedWithDesignerPubKey.value,
        
          "otpEncryptedWithPrinterPubKey":this.otpEncryptedWithPrinterPubKey.value,
        
          "printer":this.printer.value,
        
          "buyer":this.buyer.value,
        
          "blueprintMaster":this.blueprintMaster.value,
        
          "owner":this.owner.value
    };

    this.myForm.setValue({
          "blueprintCopyID":null,
        
          "printed":null,
        
          "otpEncryptedWithDesignerPubKey":null,
        
          "otpEncryptedWithPrinterPubKey":null,
        
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
        
      
        
          "otpEncryptedWithDesignerPubKey":null,
        
      
        
          "otpEncryptedWithPrinterPubKey":null,
        
      
        
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
          
            "otpEncryptedWithDesignerPubKey":this.otpEncryptedWithDesignerPubKey.value,
          
            "otpEncryptedWithPrinterPubKey":this.otpEncryptedWithPrinterPubKey.value,
          
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


  //TODO not used???
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


  cancelRequest(): Promise<any> {

    console.log(this.allBlueprintCopies);
    this.blueprintCopyID = this.currentId;

    for (let blueprintCopy of this.allBlueprintCopies) {
        console.log(blueprintCopy);
      if(blueprintCopy.blueprintCopyID == this.blueprintCopyID) {
        this.blueprintCopyCurrent = blueprintCopy;
      }
    }

    //transaction object
    this.cancelRequestObj = {
      "$class": "org.usecase.printer.CancelRequest",
      "blueprintCopy": "resource:org.usecase.printer.BlueprintCopy#"+this.blueprintCopyCurrent.blueprintCopyID
    };

    
    return this.serviceBlueprintCopy.cancel(this.cancelRequestObj)
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
          
            "otpEncryptedWithDesignerPubKey":null,
          
            "otpEncryptedWithPrinterPubKey":null,
          
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
          console.log(result)
            formObject.printed = result.printed;
          
        }else{
          formObject.printed = null;
        }
      
        if(result.otpEncryptedWithDesignerPubKey){
          
            formObject.otpEncryptedWithDesignerPubKey = result.otpEncryptedWithDesignerPubKey;
          
        }else{
          formObject.otpEncryptedWithDesignerPubKey = null;
        }
      
        if(result.otpEncryptedWithPrinterPubKey){
          
            formObject.otpEncryptedWithPrinterPubKey = result.otpEncryptedWithPrinterPubKey;
          
        }else{
          formObject.otpEncryptedWithPrinterPubKey = null;
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

  uploadCopyAsset(form: any) {

    this.fileUploadComponent.postBCDB("","","")
    .then(txId => {
      console.log("[RETURNED txID]", txId);  
    
    let currentChecksum = this.fileUploadComponent.getChecksum();

    this.asset = {
      $class: "org.usecase.printer.BlueprintCopy",
      
          "blueprintCopyID":this.blueprintCopyID.value,
          "txID":txId,
          "checksum": currentChecksum,
          "printed":this.printed.value,
          
          "otpEncryptedWithDesignerPubKey":this.otpEncryptedWithDesignerPubKey.value,
        
          "otpEncryptedWithPrinterPubKey":this.otpEncryptedWithPrinterPubKey.value,
        
          "printer":this.printer.value,
        
          "buyer":this.buyer.value,
        
          "blueprintMaster":this.blueprintMaster.value,
        
          "owner":this.owner.value
    };

    console.log(this.printed.value)

    this.myForm.setValue({
        "blueprintCopyID":null,
      
        "printed":null,
      
        "otpEncryptedWithDesignerPubKey":null,
      
        "otpEncryptedWithPrinterPubKey":null,
      
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
        
          "otpEncryptedWithDesignerPubKey":null,
        
          "otpEncryptedWithPrinterPubKey":null,
        
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
    })
    });
  }


  resetForm(): void{
    this.myForm.setValue({
        
          "blueprintCopyID":null,
        
          "printed":null,
        
          "otpEncryptedWithDesignerPubKey":null,
        
          "otpEncryptedWithPrinterPubKey":null,
        
          "printer":null,
        
          "buyer":null,
        
          "blueprintMaster":null,
        
          "owner":null 
      
      });
  }

}
