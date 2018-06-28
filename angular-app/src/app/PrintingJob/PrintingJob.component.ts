import { Component, OnInit, Input, NgModule, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PrintingJobService } from './PrintingJob.service';
import 'rxjs/add/operator/toPromise';
import { UsersPipe} from './Pipe';
import {FileuploadComponent} from "../fileupload/fileupload.component";
import {PrintingJob} from "../org.usecase.printer";


@Component({
	selector: 'app-PrintingJob',
	templateUrl: './PrintingJob.component.html',
	styleUrls: ['./PrintingJob.component.css'],
  providers: [PrintingJobService]
})

export class PrintingJobComponent implements OnInit {

  @ViewChild(FileuploadComponent)
  private fileUploadComponent: FileuploadComponent;

  myForm: FormGroup;

  private allPrintingJobAssets;
  private allStakeholders = [];

  private asset;
  private currentId;
	private errorMessage;
  private progressMessage;
  private successMessage;
  private cancelRequestObj;
  private printingJobCurrent;
  private filterID;
  private selectedElement;

  printingJobID = new FormControl("", Validators.required);
  printed = new FormControl("", Validators.required);
  otpEncryptedWithDesignerPubKey = new FormControl("", Validators.required);
  otpEncryptedWithPrinterPubKey = new FormControl("", Validators.required);
  printer = new FormControl("", Validators.required);
  buyer = new FormControl("", Validators.required);
  blueprintMaster = new FormControl("", Validators.required);
  owner = new FormControl("", Validators.required);


  constructor(private servicePrintingJob:PrintingJobService, fb: FormBuilder) {
    this.myForm = fb.group({
        printingJobID:this.printingJobID,
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

   //load all PrintingJob assets and Master associated to it
   loadAll(): Promise<any>  {
    let bpcList = [];
    return this.servicePrintingJob.getAll()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(bpc => {
        bpc.buyer = this.servicePrintingJob.getID(bpc.buyer);
        bpc.printer = this.servicePrintingJob.getID(bpc.printer);
        bpc.blueprintMaster = this.servicePrintingJob.getID(bpc.blueprintMaster);
        bpc.owner = this.servicePrintingJob.getID(bpc.owner);
        bpcList.push(bpc);
      });
    })
    .then(() => {
      for (let bpc of bpcList) {
        this.servicePrintingJob.getBlueprintMaster(bpc.blueprintMaster)
        .toPromise()
        .then((result) => {
          this.errorMessage = null;
          if(result.owner){
            bpc.designer = this.servicePrintingJob.getID(result.owner);
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
      this.allPrintingJobAssets = bpcList;
    });
  }

  //get all Stakeholders (Endusers, Designers, Printers)
	load_allStakeholders(): Promise<any> {
		let tempList = [];
		return this.servicePrintingJob.getAllDesigners()
		.toPromise()
		.then((result) => {
				this.errorMessage = null;
		result.forEach(designer => {
      tempList.push(designer);
		});
    })
    .then(() => {
      this.servicePrintingJob.getAllPrinters()
      .toPromise()
      .then((result) => {
          this.errorMessage = null;
      result.forEach(printer => {
        tempList.push(printer);
      });
      })
    })
    .then(() => {
      this.servicePrintingJob.getAllEndusers()
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
    this.printingJobID = this.currentId;
    console.log("test: " + this.currentId);
    for (let printingJob of this.allPrintingJobAssets) {
      console.log("test: " + printingJob.printingJobID);
      if(printingJob.printingJobID == this.printingJobID) {
        this.printingJobCurrent = printingJob;
      }
    }
    //transaction object
    this.cancelRequestObj = {
      "$class": "org.usecase.printer.CancelRequest",
      "printingJob": "resource:org.usecase.printer.PrintingJob#"+this.printingJobCurrent.printingJobID
    };
    return this.servicePrintingJob.cancel(this.cancelRequestObj)
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
        this.errorMessage = "404 - Could not find API route. Please check your available APIs.";
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

  //Retrieve a PrintingJob with a certain id and copy its values to the Form Object
  getForm(id: any): Promise<any>{
    return this.servicePrintingJob.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      let formObject = {
            "printingJobID":null,
            "printed":null,
            "otpEncryptedWithDesignerPubKey":null,
            "otpEncryptedWithPrinterPubKey":null,
            "printer":null,
            "buyer":null,
            "blueprintMaster":null,
            "owner":null
      };

        if(result.printingJobID){
            formObject.printingJobID = result.printingJobID;
        } else {
          formObject.printingJobID = null;
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
				this.errorMessage = "404 - Could not find API route. Please check your available APIs.";
        }
        else{
          this.progressMessage = null;
            this.errorMessage = error;
        }
    });

  }

  // Method which is called when Designer uploads the Blueprint Copy File
  uploadJobAsset(form: any) {
    this.progressMessage = 'Please wait... ';
    debugger;
    this.fileUploadComponent.postBCDB("My ipfs test key", "My description", "my owner")
    .then(txId => {
    let currentChecksum = this.fileUploadComponent.getChecksum();
    this.asset = {
      $class: "org.usecase.printer.PrintingJob",
          "printingJobID":this.printingJobID.value,
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
        "printingJobID":null,
        "printed":null,
        "otpEncryptedWithDesignerPubKey":null,
        "otpEncryptedWithPrinterPubKey":null,
        "printer":null,
        "buyer":null,
        "blueprintMaster":null,
        "owner":null
    });

    var uploadAsset = {
      $class: "org.usecase.printer.ConfirmPrintingJob",
          "txID":txId,
          "checksum": currentChecksum,
          "printingJob":this.asset.printingJobID
    };

    // For test purpose TODO Leo remove
    this.fileUploadComponent.getBCDB(txId).then(asset => {
      debugger;
      console.log(asset);
    });

    return this.servicePrintingJob.upload(uploadAsset)
    .toPromise()
    .then(() => {
			this.errorMessage = null;
      this.progressMessage = null;
      this.successMessage = 'PrintingJob uploaded successfully. Refreshing page...'
      this.myForm.setValue({
          "printingJobID":null,
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
          "printingJobID":null,
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
