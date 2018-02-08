import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BlueprintMasterService } from './BlueprintMaster.service';
import 'rxjs/add/operator/toPromise';
import { FileuploadComponent }  from '../fileupload/fileupload.component';


@Component({
	selector: 'app-BlueprintMaster',
	templateUrl: './BlueprintMaster.component.html',
	styleUrls: ['./BlueprintMaster.component.css'],
  providers: [BlueprintMasterService]
})
export class BlueprintMasterComponent implements OnInit {

  @ViewChild(FileuploadComponent)
  private fileUploadComponent: FileuploadComponent;

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;
  private allDesigners;

  private allEndusers;
  private allPrinters;

  private printer;
  private buyer;
  private blueprintMaster
  private requestBlueprintMasterObj;

  private current_db_id;

  blueprintMasterID = new FormControl("", Validators.required);
  txID = new FormControl("", Validators.required);
  checksum = new FormControl("", Validators.required);
  price = new FormControl("", Validators.required);
  metadata = new FormControl("", Validators.required);
  owner = new FormControl("", Validators.required);
  printerID = new FormControl("");
  buyerID = new FormControl("");
        
  constructor(private serviceBlueprintMaster:BlueprintMasterService, fb: FormBuilder) {
    this.myForm = fb.group({
    
          blueprintMasterID:this.blueprintMasterID,
          txID:this.txID,
          checksum: this.checksum,
          price:this.price,
          metadata:this.metadata,
          owner:this.owner,
          printerID:this.printerID,
          buyerID:this.buyerID
    
    });
  };

  ngOnInit(): void {
    this.loadAll().then(() => {                     
      this.load_OnlyDesigners();
    }).then(() => {                     
      this.load_OnlyEndusers();
    }).then(() => {                     
      this.load_OnlyPrinters();
    });    

  }

	//get all designers
	load_OnlyDesigners(): Promise<any> {
		let tempList = [];
		return this.serviceBlueprintMaster.getAllDesigners()
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

  //get all printers
	load_OnlyPrinters(): Promise<any> {
		let tempList = [];
		return this.serviceBlueprintMaster.getAllPrinters()
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
		return this.serviceBlueprintMaster.getAllEndusers()
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

  loadAll_OnlyBlueprintMaster(): Promise<any> {
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


  //load all blueprintMasters and the designers associated to them 
  loadAll(): Promise<any>  {
    
    //retrieve all BlueprintMaster
    let tempList = [];
    return this.serviceBlueprintMaster.getAll()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(blueprintMaster => {
        tempList.push(blueprintMaster);
      });     
    })
    .then(() => {

      for (let blueprintMaster of tempList) {
        console.log("in for loop")

        var splitted_ownerID = blueprintMaster.owner.split("#", 2); 
        var ownerID = String(splitted_ownerID[1]);
        console.log("Owner ID: " + ownerID);
        this.serviceBlueprintMaster.getDesigner(ownerID)
        .toPromise()
        .then((result) => {
          this.errorMessage = null;
          if(result.firstName){
            blueprintMaster.firstName = result.firstName;
          }
          if(result.lastName){
            blueprintMaster.lastName = result.lastName;
          }
        });
      }

      this.allAssets = tempList;
      if (0 < tempList.length) {
        this.current_db_id = tempList[tempList.length - 1].blueprintMasterID.substr(2)
      } else {
        this.current_db_id = 0
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

  addAsset(form: any) {
    let inputPrice = this.price.value;
    let inputMetadata = this.metadata.value;
    let owner = this.owner.value;

    this.fileUploadComponent.postBCDB(inputPrice, inputMetadata, owner)
    .then(txId => {
      console.log("[RETURNED txID]", txId);  
    
    
    this.current_db_id++;


    let currentChecksum = this.fileUploadComponent.getChecksum();

    this.asset = {
      $class: "org.usecase.printer.BlueprintMaster",
      
          "blueprintMasterID":"B_" + this.current_db_id,
          // "txID":this.txID.value,
          "txID":txId,
          "checksum": currentChecksum,
          "price":this.price.value,
          "metadata":this.metadata.value,
          "owner":this.owner.value
    };

    this.myForm.setValue({
          "blueprintMasterID":null,
          "txID":null,
          "checksum":null,
          "price":null,
          "metadata":null,
          "owner":null,
          "buyerID":null,
          "printerID":null
    });

    return this.serviceBlueprintMaster.addAsset(this.asset)
    .toPromise()
    .then(() => {
			this.errorMessage = null;
      this.myForm.setValue({
          "blueprintMasterID":null,
          "txID":null,
          "checksum":null,
          "price":null,
          "metadata":null,
          "owner":null,
          "buyerID":null,
          "printerID":null
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


   updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: "org.usecase.printer.BlueprintMaster",
            "txID": this.txID.value,
            "checksum": this.checksum.value,
            "price":this.price.value,
            "metadata":this.metadata.value,
            "owner":this.owner.value,
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


  requestAsset(form: any): Promise<any> {
   
     //get printer
     for (let printer of this.allPrinters) {    
      if(printer.stakeholderID == this.printerID.value){
        console.log(printer);
        this.printer = printer;
      }     
    }

    //get buyer
    for (let buyer of this.allEndusers) {
      if(buyer.stakeholderID == this.buyerID.value){
        console.log(buyer);
        this.buyer = buyer;
      }     
    }

    //get blueprintMaster
    for (let blueprintMaster of this.allAssets) {
      if(blueprintMaster.blueprintMasterID == this.currentId){
        console.log(blueprintMaster);
        this.blueprintMaster = blueprintMaster;
      }     
    }

    //transaction object
    this.requestBlueprintMasterObj = {
      $class: "org.usecase.printer.RequestBlueprint",
      "buyer": this.buyerID.value,
      "printer": this.printerID.value,
      "blueprintMaster": this.currentId
    };

    return this.serviceBlueprintMaster.requestBlueprint(this.requestBlueprintMasterObj)
    .toPromise()
    .then((result) => {
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
        else if(error == '500 - Internal Server Error') {
          this.errorMessage = 'Cannot buy asset. Not enough funds.';
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
            "txID":null,
            "checksum":null,
            "price":null,
            "metadata":null,
            "printerID":null,
            "buyerID":null,
            "owner":null 
      };

        if(result.blueprintMasterID){
          
            formObject.blueprintMasterID = result.blueprintMasterID;
          
        }else{
          formObject.blueprintMasterID = null;
        }
      
        if(result.txID){
          
            formObject.txID = result.txID;
          
        }else{
          formObject.txID = null;
        }
      
        if(result.checksum) {
          formObject.checksum = result.checksum;
        } else {
          formObject.checksum = null;
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
          "txID":null,
          "checksum":null,
          "price":null,
          "metadata":null,
          "owner":null,
          "buyerID":null,
          "printerID":null
      });
  }

}
