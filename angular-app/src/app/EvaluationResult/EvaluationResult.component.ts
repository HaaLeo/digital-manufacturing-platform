import { Component, OnInit } from '@angular/core';
import {BlueprintMasterService} from "../BlueprintMaster/BlueprintMaster.service";
import {FileuploadComponent} from "../fileupload/fileupload.component";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {EvaluationResultService} from "./EvaluationResult.service";

@Component({
  selector: 'app-evaluation-result',
  templateUrl: './EvaluationResult.component.html',
  styleUrls: ['./EvaluationResult.component.css'],
    providers: [EvaluationResultService]
})
export class EvaluationResultComponent implements OnInit {

    myForm: FormGroup;

    private allAssets;
    private errorMessage;
    private progressMessage;

    private allDesigners;
    private allEndusers;
    private allPrinters;

    private current_db_id;

    evaluationResultID = new FormControl("", Validators.required);
    txID = new FormControl("", Validators.required);
    requirementsMet= new FormControl("", Validators.required);
    customer = new FormControl("", Validators.required);
    printingJob = new FormControl("", Validators.required);

    constructor(private serviceEvaluationResult:EvaluationResultService, fb: FormBuilder) {
        this.myForm = fb.group({
            evaluationResultID:this.evaluationResultID,
            txID:this.txID,
            requirementsMet: this.requirementsMet,
            customer:this.customer,
            printingJob:this.printingJob
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
        return this.serviceEvaluationResult.getAllDesigners()
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

    //Get all Printers
    load_OnlyPrinters(): Promise<any> {
        let tempList = [];
        return this.serviceEvaluationResult.getAllPrinters()
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
                    this.errorMessage = "404 - Could not find API route. Please check your available APIs.";
                }
                else{
                    this.progressMessage = null;
                    this.errorMessage = error;
                }
            });
    }

    //Get all Endusers
    load_OnlyEndusers(): Promise<any> {
        let tempList = [];
        return this.serviceEvaluationResult.getAllEndusers()
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

    // TODO implement transaction for transfering password to Manufactueer
    setId(id: any): void {
        debugger;
         this.current_db_id = id;
    }

    //Get all EvaluationResult Assets and the Endusers associated to them
    loadAll(): Promise<any>  {
        //retrieve all Evaluation Results
        let tempList = [];
        return this.serviceEvaluationResult.getAll()
            .toPromise()
            .then((result) => {
                this.errorMessage = null;
                result.forEach(evaluationResult => {
                    tempList.push(evaluationResult);
                });
                debugger;
                this.allAssets = tempList;
            });
    }

}

