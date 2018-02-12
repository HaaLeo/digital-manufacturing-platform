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

	//Get all Designers
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

  //Get all Printers
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

  //Get all Endusers
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

  //Gtet all BlueprintMaster Assets and the Designers associated to them 
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
        var splitted_ownerID = blueprintMaster.owner.split("#", 2); 
        var ownerID = String(splitted_ownerID[1]);
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

  // Method called when a Designer wants to upload a new BlueprintMaster Asset
  addAsset(form: any) {
    let inputPrice = this.price.value;
    let inputMetadata = this.metadata.value;
    let owner = this.owner.value;
    this.fileUploadComponent.postBCDB(inputPrice, inputMetadata, owner)
    .then(txId => {
    this.current_db_id++;
    let currentChecksum = this.fileUploadComponent.getChecksum();
    this.asset = {
      $class: "org.usecase.printer.BlueprintMaster",
          "blueprintMasterID":"B_" + this.current_db_id,
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

  // Method called when a Enduser wants to Buy a Copy of the BlueprintMaster Asset
  requestAsset(form: any): Promise<any> {
     //Get selected Printer
     for (let printer of this.allPrinters) {    
      if(printer.stakeholderID == this.printerID.value){
        this.printer = printer;
      }     
    }
    //Get selected Endusers
    for (let buyer of this.allEndusers) {
      if(buyer.stakeholderID == this.buyerID.value){
        this.buyer = buyer;
      }     
    }
    //get selected BlueprintMaster
    for (let blueprintMaster of this.allAssets) {
      if(blueprintMaster.blueprintMasterID == this.currentId){
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

  //Retrieve a BlueprintCopy with a certain id and copy its values to the Form Object
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

  // Reset all Value incurrently saved in the Form Object
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
