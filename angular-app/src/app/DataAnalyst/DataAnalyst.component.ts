import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DataAnalystService} from "./DataAnalyst.service";
import {DataAnalyst} from "../org.usecase.printer";

@Component({
  selector: 'app-data-analyst',
  templateUrl: './DataAnalyst.component.html',
  styleUrls: ['./DataAnalyst.component.css'],
    providers: [DataAnalystService]
})

export class DataAnalystComponent {
    myForm: FormGroup;

    private allDataAnalysts;
    private dataAnalyst;
    private currentId;
    private errorMessage;
    private progressMessage;
    private successMessage;

    private current_db_id;

    stakeholderID = new FormControl("", Validators.required);
    pubKey = new FormControl("", Validators.required);
    name = new FormControl("", Validators.required);

    constructor(private serviceDataAnalyst: DataAnalystService, fb: FormBuilder) {
        this.myForm = fb.group({
            stakeholderID:this.stakeholderID,
            pubKey:this.pubKey,
            name:this.name
        });
    };

    ngOnInit(): void {
        this.loadAll();
    }

    resetForm(): void{
        this.myForm.setValue({
            "stakeholderID":null,
            "pubKey":null,
            "name":null
        });
    }

    //allow update name of DataAnalyst
    updateDataAnalyst(form: any): Promise<any> {
        this.progressMessage = 'Please wait... ';
        this.dataAnalyst = {
            $class: "org.usecase.printer.DataAnalyst",
            "pubKey":this.pubKey.value,
            "name":this.name.value
        };
        return this.serviceDataAnalyst.updateDataAnalyst(form.get("stakeholderID").value,this.dataAnalyst)
            .toPromise()
            .then(() => {
                this.errorMessage = null;
                this.progressMessage = null;
                this.successMessage = 'DataAnalyst updated successfully. Refreshing page...';
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

    //delete DataAnalyst and the cash assets associated to it
    deleteDataAnalyst(): Promise<any> {
        this.progressMessage = 'Please wait... ';
        return this.serviceDataAnalyst.deleteDataAnalyst(this.currentId)
            .toPromise()
            .then(() => {
                this.errorMessage = null;
                this.progressMessage = null;
                this.successMessage = 'Data Analyst deleted successfully. Refreshing page...';
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

    getForm(id: any): Promise<any>{
        return this.serviceDataAnalyst.getDataAnalyst(id)
            .toPromise()
            .then((result) => {
                this.errorMessage = null;
                let formObject = {
                    "stakeholderID":null,
                    "pubKey":null,
                    "name":null
                };
                if(result.stakeholderID){
                    formObject.stakeholderID = result.stakeholderID;
                }else{
                    formObject.stakeholderID = null;
                }

                if(result.pubKey){
                    formObject.pubKey = result.pubKey;
                }else{
                    formObject.pubKey = null;
                }

                if(result.name){
                    formObject.name = result.name;
                }else{
                    formObject.name = null;
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

    //load all DataAnalysts and the cash assets associated to them
    loadAll(): Promise<any>  {
        //retrieve all dataAnalysts
        let dataAnalystList = [];
        return this.serviceDataAnalyst.getAllDataAnalysts()
            .toPromise()
            .then((result) => {
                this.errorMessage = null;
                result.forEach(dataAnalyst => {
                    dataAnalystList.push(dataAnalyst);
                });
                this.allDataAnalysts = dataAnalystList;
                if (0 < dataAnalystList.length) {
                    this.current_db_id = dataAnalystList[dataAnalystList.length - 1].stakeholderID.substr(2);
                } else {
                    this.current_db_id = 0;
                }
            });
    }

    //add DataAnalyst participant
    addDataAnalyst(form: any): Promise<any> {
        this.progressMessage = 'Please wait... ';
        return this.createAssetsDataAnalyst()
            .then(() => {
                this.errorMessage = null;
                this.progressMessage = null;
                this.successMessage = 'Data Analyst added successfully. Refreshing page...';
                this.myForm.setValue({
                    "stakeholderID":null,
                    "pubKey":null,
                    "name":null
                });
            })
            .catch((error) => {
                if(error == 'Server error'){
                    this.progressMessage = null;
                    this.errorMessage = "Could not connect to REST server. Please check your configuration details";
                }
                else if (error == '500 - Internal Server Error') {
                    this.progressMessage = null;
                    this.errorMessage = "Input error";
                }
                else{
                    this.progressMessage = null;
                    this.errorMessage = error;
                }
            });
    }

    //create cash asset associated with the DataAnalyst, followed by the DataAnalyst
    createAssetsDataAnalyst(): Promise<any> {
        this.current_db_id++;
        this.dataAnalyst = {
            $class: "org.usecase.printer.DataAnalyst",
            "stakeholderID":"P_" + this.current_db_id,
            "pubKey":this.pubKey.value,
            "name":this.name.value
        };
        return this.serviceDataAnalyst.addDataAnalyst(this.dataAnalyst)
            .toPromise()
            .then(() => {
                location.reload();
            });
    }
}
