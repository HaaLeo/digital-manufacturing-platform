import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { BuyAssetTRService } from './BuyAssetTR.service';
import {Printer, PrintingJob, QualityReport, Stakeholder} from "../org.usecase.printer";
import {QualityReportService} from "../QualityReport/QualityReport.service";
import {PrinterService} from "../Printer/Printer.service";

declare function require(name:string);
let sha512 = require('js-sha512');

@Component({
	selector: 'app-BuyAssetTR',
	templateUrl: './BuyAssetTR.component.html',
	styleUrls: ['./BuyAssetTR.component.css'],
  	providers: [BuyAssetTRService, QualityReportService, PrinterService]
})

export class BuyAssetTRComponent {
	myForm: FormGroup;
    printingJobID = new FormControl("", Validators.required);

	private transactionFrom;
	private errorMessage;
	private progressMessage;
    private successMessage;
	private allPrintingJobs;
	private allPrinters;
	private printer;

	private printingJobCurrent;
	private confirmTransactionObj;
	private qualityReportObj;
    private transactionID;
	private selectedJob;
    private evaluateReportObj;
    private current_db_id;

	constructor(private serviceTransaction: BuyAssetTRService, fb: FormBuilder,
                private serviceQualityReport: QualityReportService, private servicePrinter: PrinterService) {
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
		this.loadAllQualityReports();
        this.loadAllPrinters();
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
  	};

    // Get all QualityReports
    loadAllQualityReports(): Promise<any> {
        const tempList = [];
        return this.serviceQualityReport.getAll()
            .toPromise()
            .then((result) => {
                this.errorMessage = null;
                result.forEach(qualityReport => {
                        tempList.push(qualityReport);
                });
                debugger;
                if ( 0 < tempList.length) {
                    this.current_db_id = tempList[tempList.length - 1];
                } else {
                    this.current_db_id = 0;
                }
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

    loadAllPrinters(): Promise<any> {
        const tempList = [];
        return this.servicePrinter.getAllPrinters()
            .toPromise()
            .then((result) => {
                this.errorMessage = null;
                result.forEach(printer => {
                    tempList.push(printer);
                });
               this.allPrinters = tempList;
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

  	evaluateReport(form: any){
  	    debugger;
        this.evaluateReportObj = {
            $class: "org.usecase.printer.EvaluateReport",
            "printingJob": this.printingJobCurrent.printingJobID, // includes Quality Requirement and BlueprintMaster
            "customer": this.printingJobCurrent.buyer,
            "qualityReport": this.qualityReportObj,
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

    uploadQualityReport(form: any){

        console.log(this.allPrintingJobs);
        for (const printingJob of this.allPrintingJobs) {
            if (printingJob.printingJobID == this.printingJobID.value) {
                this.printingJobCurrent = printingJob;
                debugger;
            }
        }
        console.log(this.allPrinters);
        for (const printer of this.allPrinters) {
            debugger;
            if (printer.stakeholderID == this.printingJobCurrent.printer.split("#")[1]) {
                this.printer = printer;
                debugger;
            }
        }
        debugger;
        let qualityCriteria = {
            "peakPressure":Math.random()*3000,
            "peakTemperature": Math.random()*800
        };
        this.current_db_id =(this.allPrinters).length;
        debugger;
        this.qualityReportObj = {
            "$class": "org.usecase.printer.QualityReport",
            "qualityReportID":"QREP_" + this.current_db_id,
            "txID": sha512(JSON.stringify(qualityCriteria)),
            "databaseHash": sha512(Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 255)),
            "owner": this.printer.printerManufacturer,
            "printingJob": "resource:org.usecase.printer.PrintingJob#"+this.printingJobCurrent.printingJobID,
        };
        debugger;
        return this.serviceQualityReport.addAsset(this.qualityReportObj)
            .toPromise()
            .then(() => {
                debugger;
                this.errorMessage = null;
                this.progressMessage = null;
                this.successMessage = 'QualityReport added successfully.';
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
