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
  private allStakeholders = [];

  private asset;
  private currentId;
	private errorMessage;
  private progressMessage;
  private successMessage;
  private cancelRequestObj;
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
    this.load_allStakeholders().then(() => {                     
      this.loadAll();
    });    
    this.selectedElement = "all"
  }

   //load all BlueprintCopy assets and Master associated to it
   loadAll(): Promise<any>  {
    let bpcList = [];
    return this.serviceBlueprintCopy.getAll()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(bpc => {
        bpc.buyer = this.serviceBlueprintCopy.getID(bpc.buyer);
        bpc.printer = this.serviceBlueprintCopy.getID(bpc.printer);
        bpc.blueprintMaster = this.serviceBlueprintCopy.getID(bpc.blueprintMaster);
        bpc.owner = this.serviceBlueprintCopy.getID(bpc.owner);
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
            for (let stakeholder of this.allStakeholders) {
              if(stakeholder.stakeholderID == bpc.designer) {
                bpc.designerName = stakeholder.firstName + " " + stakeholder.lastName;
              }
              if(stakeholder.stakeholderID == bpc.buyer) {
                bpc.buyerName = stakeholder.firstName + " " + stakeholder.lastName;
              }
              if(stakeholder.stakeholderID == bpc.owner) {
                bpc.ownerName = stakeholder.firstName + " " + stakeholder.lastName;
              }
              if(stakeholder.stakeholderID == bpc.printer) {
                bpc.printerName = stakeholder.name;
                bpc.printerPubKey = stakeholder.pubKey;
              }
            }
          }
        });
      }
      this.allBlueprintCopyAssets = bpcList;
    });
  }

  //get all Stakeholders (Endusers, Designers, Printers)
	load_allStakeholders(): Promise<any> {
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

  // Method called when Enduser wants to cancel his purchase
  cancelRequest(): Promise<any> {
    this.progressMessage = 'Please wait... ';
    this.blueprintCopyID = this.currentId;
    console.log("test: " + this.currentId);
    for (let blueprintCopy of this.allBlueprintCopyAssets) {
      console.log("test: " + blueprintCopy.blueprintCopyID);
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
      this.progressMessage = null;
      this.successMessage = 'Request was cancelled successfully. Refreshing page...'
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

  setId(id: any): void{
    this.currentId = id;
  }

  //Retrieve a BlueprintCopy with a certain id and copy its values to the Form Object
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
        } else {
          formObject.blueprintCopyID = null;
        }

        if(result.printed != null){
            formObject.printed = result.printed;
        } else {
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

  // Method which is called when Designer uploads the Blueprint Copy File
  uploadCopyAsset(form: any) {
    this.progressMessage = 'Please wait... ';
    this.fileUploadComponent.postBCDB("","","")
    .then(txId => {
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

    var uploadAsset = {
      $class: "org.usecase.printer.UploadBlueprintCopy",
          "txID":txId,
          "checksum": currentChecksum,
          "blueprintCopy":this.asset.blueprintCopyID
    };

    return this.serviceBlueprintCopy.upload(uploadAsset)
    .toPromise()
    .then(() => {
			this.errorMessage = null;
      this.progressMessage = null;
      this.successMessage = 'Blueprint uploaded successfully. Refreshing page...'
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
          this.progressMessage = null;
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        } else if(error == '500 - Internal Server Error') {
          this.progressMessage = null;
          this.errorMessage = 'Content of uploaded file doesn\'t match the content of the master asset.';
        }
        else{
          this.progressMessage = null;
            this.errorMessage = error;
        }
    })
    });
  }

  // Reset all Value incurrently saved in the Form Object
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
