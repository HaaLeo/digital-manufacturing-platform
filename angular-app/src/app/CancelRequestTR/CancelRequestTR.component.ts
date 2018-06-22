import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CancelRequestTRService } from './CancelRequestTR.service';

@Component({
	selector: 'app-CancelRequestTR',
	templateUrl: './CancelRequestTR.component.html',
	styleUrls: ['./CancelRequestTR.component.css'],
  	providers: [CancelRequestTRService]
})

export class CancelRequestTRComponent {
	myForm: FormGroup;
    printingJobID = new FormControl('', Validators.required);

	private transactionFrom;
	private errorMessage;
	private progressMessage;
  private successMessage;
	private allPrintingJobs;

	private printingJobCurrent;
	private cancelRequestObj;
	private transactionID;
	private selectedJob;

	constructor(private serviceTransaction: CancelRequestTRService, fb: FormBuilder) {
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

	//Get all PrintingJobs
	loadAllPrintingJobs(): Promise<any> {
		const tempList = [];
		return this.serviceTransaction.getAllPrintingJobs()
		.toPromise()
		.then((result) => {
				this.errorMessage = null;
		result.forEach(printingJob => {
			//DISPLAY ONLY PRINTING JOBS THAT HAVEN'T PRINTED YET
			if (printingJob.printed == false)
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
  	this.progressMessage = 'Please wait... ';

		for (const printingJob of this.allPrintingJobs) {
			if (printingJob.printingJobID == this.printingJobID.value) {
				this.printingJobCurrent = printingJob;
			}
		}
    	this.cancelRequestObj = {
	      '$class': 'org.usecase.printer.CancelRequest',
	      'printingJob': 'resource:org.usecase.printer.PrintingJob#' + this.printingJobCurrent.printingJobID
	    };
	    return this.serviceTransaction.cancelRequest(this.cancelRequestObj)
	    .toPromise()
	    .then((result) => {
	    	this.selectedJob = null;

	    	this.errorMessage = null;
	    	this.progressMessage = null;
        this.successMessage = 'Request was cancelled successfully.';

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
