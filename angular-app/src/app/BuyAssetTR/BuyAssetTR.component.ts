import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { BuyAssetTRService } from './BuyAssetTR.service';

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
    private qualityProperties: { peakTemperature: number; peakPressure: number };

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

	mockQualityProperties(){
        return {
            peakTemperature: Math.random()*300,
            peakPressure: Math.random() *3000
        }; //peakPressure in mBar
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
	    	this.selectedJob = null;
	    	this.errorMessage = null;
	    	this.progressMessage = null;
            this.successMessage = 'Transaction executed successfully.';
              this.transactionID = result.transactionId;
              this.qualityProperties = this.mockQualityProperties();
              // TODO generate qualityReport and upload
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
