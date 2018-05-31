import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { QualityRequirementService } from './QualityRequirement.service';
import 'rxjs/add/operator/toPromise';
import { FileuploadComponent }  from '../fileupload/fileupload.component';
import {QualityRequirement} from "../org.usecase.printer";


@Component({
	selector: 'app-QualityRequirement',
	templateUrl: './QualityRequirement.component.html',
	styleUrls: ['./QualityRequirement.component.css'],
  providers: [QualityRequirementService]
})
export class QualityRequirementComponent implements OnInit {

  @ViewChild(FileuploadComponent)
  private fileUploadComponent: FileuploadComponent;

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;
  private progressMessage;
  private successMessage;

  private allCustomers;
  private allPrinters;

  private printer;
  private qualityRequirement;
  private requestQualityRequirementObj;

  private current_db_id;

  qualityRequirementID = new FormControl("", Validators.required);
  txID = new FormControl("", Validators.required);
  checksum = new FormControl("", Validators.required);
  price = new FormControl("", Validators.required);
  metadata = new FormControl("", Validators.required);
  owner = new FormControl("", Validators.required);
  printerID = new FormControl("");

  constructor(private serviceQualityRequirement:QualityRequirementService, fb: FormBuilder) {
    this.myForm = fb.group({
          qualityRequirementID:this.qualityRequirementID,
          txID:this.txID,
          checksum: this.checksum,
          price:this.price,
          metadata:this.metadata,
          owner:this.owner,
          printerID:this.printerID,
    });
  };

  ngOnInit(): void {
    this.loadAll().then(() => {                     
      this.load_OnlyCustomers();
    }).then(() => {
      this.load_OnlyPrinters();
    });    

  }

	//Get all Customers
	load_OnlyCustomers(): Promise<any> {
		let tempList = [];
		return this.serviceQualityRequirement.getAllCustomers()
		.toPromise()
		.then((result) => {
				this.errorMessage = null;
		result.forEach(customer => {
      tempList.push(customer);
		});
		this.allCustomers = tempList;
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

  //Get all Printers
	load_OnlyPrinters(): Promise<any> {
		let tempList = [];
		return this.serviceQualityRequirement.getAllPrinters()
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

  //Get all QualityRequirement Assets and the Customers associated to them
  loadAll(): Promise<any>  {
    //retrieve all QualityRequirement
    let tempList = [];
    return this.serviceQualityRequirement.getAll()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(qualityRequirement => {
        tempList.push(qualityRequirement);
      });     
    })
    .then(() => {
      for (let qualityRequirement of tempList) {
        var splitted_ownerID = qualityRequirement.owner.split("#", 2);
        var ownerID = String(splitted_ownerID[1]);
        this.serviceQualityRequirement.getCustomer(ownerID)
        .toPromise()
        .then((result) => {
          this.errorMessage = null;
          if(result.firstName){
              qualityRequirement.firstName = result.firstName;
          }
          if(result.lastName){
              qualityRequirement.lastName = result.lastName;
          }
        });
      }
      this.allAssets = tempList;
      if (0 < tempList.length) {
        this.current_db_id = tempList[tempList.length - 1].qualityRequirementID.substr(2)
      } else {
        this.current_db_id = 0
      }
    });
  }

  // Method called when a Customer wants to upload a new QualityRequirement Asset
  addAsset(form: any) {
    this.progressMessage = 'Please wait... ';
    let inputPrice = this.price.value;
    let inputMetadata = this.metadata.value;
    let owner = this.owner.value;
    this.fileUploadComponent.postBCDB(inputPrice, inputMetadata, owner)
    .then(txId => {
    this.current_db_id++;
    let currentChecksum = this.fileUploadComponent.getChecksum();
    this.asset = {
      $class: "org.usecase.printer.QualityRequirement",
          "qualityRequirementID":"B_" + this.current_db_id,
          "txID":txId,
          "checksum": currentChecksum,
          "price":this.price.value,
          "metadata":this.metadata.value,
          "owner":this.owner.value
    };
    this.myForm.setValue({
          "qualityRequirementID":null,
          "txID":null,
          "checksum":null,
          "price":null,
          "metadata":null,
          "owner":null,
          "printerID":null
    });
    return this.serviceQualityRequirement.addAsset(this.asset)
    .toPromise()
    .then(() => {
			this.errorMessage = null;
      this.progressMessage = null;
      this.successMessage = 'Blueprint added successfully. Refreshing page...';
      this.myForm.setValue({
          "qualityRequirementID":null,
          "txID":null,
          "checksum":null,
          "price":null,
          "metadata":null,
          "owner":null,
          "printerID":null
      });
      location.reload();
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.progressMessage = null;
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else{
            this.progressMessage = null;
            this.errorMessage = error;
        }
    })
    });
  }

  // Method called when a Enduser wants to Buy a Copy of the QualityRequirement Asset
  requestAsset(form: any): Promise<any> {
    this.progressMessage = 'Please wait... ';
     //Get selected Printer
     for (let printer of this.allPrinters) {    
      if(printer.stakeholderID == this.printerID.value){
        this.printer = printer;
      }     
    }
    //get selected QualityRequirement
    for (let qualityRequirement of this.allAssets) {
      if(qualityRequirement.qualityRequirementID == this.currentId){
        this.qualityRequirement = qualityRequirement;
      }     
    }
    //transaction object
    this.requestQualityRequirementObj = {
      $class: "org.usecase.printer.RequestBlueprint",
      "printer": this.printerID.value,
      "qualityRequirement": this.currentId
    };
    return this.serviceQualityRequirement.requestBlueprint(this.requestQualityRequirementObj)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      this.progressMessage = null;
      this.successMessage = 'Request was sent to the customer. Refreshing page...';
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
        else if(error == '500 - Internal Server Error') {
          this.progressMessage = null;
          this.errorMessage = 'Cannot buy asset. Not enough funds.';
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
    return this.serviceQualityRequirement.getAsset(id)
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      let formObject = {
            "qualityRequirementID":null,
            "txID":null,
            "checksum":null,
            "price":null,
            "metadata":null,
            "printerID":null,
            "owner":null
      };
        if(result.qualityRequirementID){
            formObject.qualityRequirementID = result.qualityRequirementID;
        }else{
          formObject.qualityRequirementID = null;
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

  // Reset all Value incurrently saved in the Form Object
  resetForm(): void{
    this.myForm.setValue({
          "qualityRequirementID":null,
          "txID":null,
          "checksum":null,
          "price":null,
          "metadata":null,
          "owner":null,
          "printerID":null
      });
  }
}
