import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { BuyAssetTRService } from './BuyAssetTR.service';
import {Printer, PrintingJob, QualityReport, Stakeholder} from "../org.usecase.printer";

@Component({
	selector: 'app-BuyAssetTR',
	templateUrl: './BuyAssetTR.component.html',
	styleUrls: ['./BuyAssetTR.component.css'],
  	providers: [BuyAssetTRService]
})

export class BuyAssetTRComponent {
	myForm: FormGroup;
    printingJobID = new FormControl("", Validators.required);

	private transactionFrom;
	private errorMessage;
	private progressMessage;
  private successMessage;
	private allPrintingJobs;

	private printingJobCurrent;
	private confirmTransactionObj;
	private transactionID;
	private selectedJob;
    private qualityProperties;
    private evaluateReportObj;

	constructor(private serviceTransaction: BuyAssetTRService, fb: FormBuilder) {
		this.myForm = fb.group({
            printingJobID: this.printingJobID,
	  });
	}

	ngOnInit(): void {
		this.transactionFrom  = false;
		this.loadAllPrintingJobs()
		.then(() => {
				this.transactionFrom  = true;
		});

	  }

	// Get all PrintingJobs
	loadAllPrintingJobs(): Promise<any> {
		const tempList = [];
		return this.serviceTransaction.getAllPrintingJobs()
		.toPromise()
		.then((result) => {
				this.errorMessage = null;
		result.forEach(printingJob => {
			//DISPLAY ONLY PRINTING JOBS THAT HAVEN'T PRINTED YET
			if (printingJob.txID != '' && !printingJob.printed )
				tempList.push(printingJob);
		});
		this.allPrintingJobs = tempList;
		})
		.catch((error) => {
			if (error == 'Server error'){
				this.progressMessage = null;
				this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
			}
			else if (error == '404 - Not Found'){
				this.progressMessage = null;
					this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
			}
			else{
				this.progressMessage = null;
				this.errorMessage = error;
			}
		});
  	}
    /**
    TODO uploadQualityReport to ipfs. (as a json.) read this and pass it into the evaluateReport Method.
     This might be implemented in an own transaction. Do not forget to upload QualityRequirement properly aswell.
    **/

  	evaluateReport(form: any){
	    debugger;
        this.evaluateReportObj = {
            $class: "org.usecase.printer.EvaluateReport",
            "printingJob": this.printingJobCurrent, // includes Quality Requirement and BlueprintMaster
            "customer": this.printingJobCurrent.buyer,
            "qualityReport": this.qualityProperties,
        };
        debugger;
        this.serviceTransaction.evaluateReport(this.evaluateReportObj)
            .toPromise()
            .then((result) => {
                this.selectedJob = null;
                this.errorMessage = null;
                this.progressMessage = null;
                this.successMessage = 'Transaction executed successfully.';
                this.transactionID = result.transactionId;
            })
            .catch((error) => {
                if (error == 'Server error'){
                    this.progressMessage = null;
                    this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
                }
                else if (error == '404 - Not Found'){
                    this.progressMessage = null;
                    this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
                }
                else {
                    this.progressMessage = null;
                    this.errorMessage = error;
                }
            });
    }

  	execute(form: any){
	    debugger;
		this.progressMessage = 'Please wait... ';
  	console.log(this.allPrintingJobs);
		for (const printingJob of this.allPrintingJobs) {
			if (printingJob.printingJobID == this.printingJobID.value) {
				this.printingJobCurrent = printingJob;
				debugger;
			}
		}
    	this.confirmTransactionObj = {
	      "$class": "org.usecase.printer.ConfirmTransaction",
	      "printingJob": "resource:org.usecase.printer.PrintingJob#"+this.printingJobCurrent.printingJobID
	    };
	    return this.serviceTransaction.printBlueprint(this.confirmTransactionObj)
	    .toPromise()
	    .then((result) => {
	        // this.uploadQualityReport(form);
            debugger;
            // this.evaluateReport(form); TODO first upload qualityReport properly
	    	this.selectedJob = null;
	    	this.errorMessage = null;
	    	this.progressMessage = null;
            this.successMessage = 'Transaction executed successfully.';
              this.transactionID = result.transactionId;
              this.qualityProperties = {"peakTemperature":100, "peakPressure":50};
        })
	    .catch((error) => {
                if (error == 'Server error'){
                	this.progressMessage = null;
                    this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
                }
                else if (error == '404 - Not Found'){
                	this.progressMessage = null;
                	this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
                }
                else{
                	this.progressMessage = null;
                    this.errorMessage = error;
                }
            }).then(() => {
            	if (this.errorMessage == 'Cannot buy asset. Not enough funds.') {
            		this.transactionFrom = true;
            	} else
 		             this.transactionFrom = false;
            });
  	}
}
