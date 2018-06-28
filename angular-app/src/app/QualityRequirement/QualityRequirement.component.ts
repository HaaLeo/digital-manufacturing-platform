import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FileuploadComponent} from "../fileupload/fileupload.component";
import {QualityRequirementService} from "./QualityRequirement.service";

@Component({
  selector: 'app-quality-requirement',
  templateUrl: './QualityRequirement.component.html',
  styleUrls: ['./QualityRequirement.component.css'],
    providers:[QualityRequirementService]
})
export class QualityRequirementComponent implements OnInit {

    @ViewChild(FileuploadComponent)
    private fileUploadComponent: FileuploadComponent;

    myForm: FormGroup;

    private errorMessage;
    private progressMessage;
    private allEndusers;

    qualityRequirementID = new FormControl("", Validators.required);
    txID = new FormControl("", Validators.required);
    owner = new FormControl("", Validators.required);

    constructor(private serviceQualityRequirement:QualityRequirementService, fb: FormBuilder) {
        this.myForm = fb.group({
            qualityRequirementID:this.qualityRequirementID,
            txID:this.txID,
            owner:this.owner,
        });
    };

    ngOnInit(): void {
        this.loadAll().then(() => {
            this.load_OnlyEndusers();
        });

    }

    //Get all Endusers
    load_OnlyEndusers(): Promise<any> {
        let tempList = [];
        return this.serviceQualityRequirement.getAllEndusers()
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

    //Get all QualityRequirement Assets and the Designers associated to them
    loadAll(): Promise<any>  {
        //retrieve all BlueprintMaster
        let tempList = [];
        return this.serviceQualityRequirement.getAll()
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
                    this.serviceQualityRequirement.getEnduser(ownerID)
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
            });
    }

    // Method called when a Designer wants to upload a new BlueprintMaster Asset
    addAsset(form: any) {
        this.progressMessage = 'Please wait... ';
        let owner = this.owner.value;
        // @a.beale: Upload file here to ipfs and on the response upload the txID to BigChainDB
    }


    //Retrieve a QualityRequirement with a certain id and printingJob its values to the Form Object
    getForm(id: any): Promise<any>{
        return this.serviceQualityRequirement.getAsset(id)
            .toPromise()
            .then((result) => {
                this.errorMessage = null;
                let formObject = {
                    "qualityRequirementID":null,
                    "txID":null,
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

    // Reset all Value incurrently saved in the Form Object
    resetForm(): void{
        this.myForm.setValue({
            "qualityRequirementID":null,
            "txID":null,
            "owner":null,
        });
    }
}
