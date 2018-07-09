import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { BuyAssetTRService } from './BuyAssetTR.service';
import {Printer, PrintingJob, QualityReport, QualityReportRawData, Stakeholder} from "../org.usecase.printer";
import {QualityReportService} from "../QualityReport/QualityReport.service";
import {PrinterService} from "../Printer/Printer.service";
import {QualityReportRawDataService} from "../QualityReportRaw/QualityReportRaw.service";

declare function require(name:string);
let sha512 = require('js-sha512');

@Component({
	selector: 'app-BuyAssetTR',
	templateUrl: './BuyAssetTR.component.html',
	styleUrls: ['./BuyAssetTR.component.css'],
  	providers: [BuyAssetTRService, QualityReportService, PrinterService, QualityReportRawDataService]
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
	private allQualityReports;
	private allQualityReportRawData;
	private printer;

	private printingJobCurrent;
    private qualityReportCurrent;
    private qualityReportRawDataObj;
    private confirmTransactionObj;
	private qualityReportObj;
    private transactionID;
	private selectedJob;
    private evaluateReportObj;
    private current_db_id;

	constructor(private serviceTransaction: BuyAssetTRService, fb: FormBuilder,
                private serviceQualityReport: QualityReportService,
                private serviceQualityReportRawData: QualityReportRawDataService,
                private servicePrinter: PrinterService) {
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
        this.loadAllQualityReportRawData();
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
                this.allQualityReports = tempList;
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

    // Get all QualityReports
    loadAllQualityReportRawData(): Promise<any> {
        const tempList = [];
        return this.serviceQualityReportRawData.getAll()
            .toPromise()
            .then((result) => {
                this.errorMessage = null;
                result.forEach(qualityReportRawData => {
                    tempList.push(qualityReportRawData);
                });
                this.allQualityReportRawData = tempList;
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
  	    // TODO read from QualityRequirement Asset and decrypt
        let peakTemperature = Math.floor(Math.random()*500);
        let peakPressure = Math.floor(Math.random()*500);

        // TODO read from DB
        let temperature = Math.floor(Math.random()*300);
        let pressure = Math.floor(Math.random()*3000);


        this.progressMessage = 'Please wait... ';
        console.log(this.allPrintingJobs);
        for (const printingJob of this.allPrintingJobs) {
            if (printingJob.printingJobID == this.printingJobID.value) {
                this.printingJobCurrent = printingJob;
            }
        }

        for (const qualityReport of this.allQualityReports) {
            if (qualityReport.printingJob == "resource:org.usecase.printer.PrintingJob#"+this.printingJobCurrent.printingJobID) {
                this.qualityReportCurrent = qualityReport;
            }
        }

        this.evaluateReportObj = {
            $class: "org.usecase.printer.EvaluateReport",
            "temperature": temperature,
            "pressure": pressure,
            "peakTemperature": peakTemperature,
            "peakPressure": peakPressure,
            "printingJob": 'resource:org.usecase.printer.PrintingJob#'+this.printingJobCurrent.printingJobID,
            "customer": this.printingJobCurrent.buyer,
            "qualityReport": 'resource:org.usecase.printer.QualityReport#'+this.qualityReportCurrent.qualityReportID,
        };
        this.serviceTransaction.evaluateReport(this.evaluateReportObj)
            .toPromise()
            .then((result) => {
                this.selectedJob = null;
                this.errorMessage = null;
                this.progressMessage = null;
                this.successMessage = 'Report evaluated successfully.';
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

    transferRawData(form: any){
        for (const printingJob of this.allPrintingJobs) {
            if (printingJob.printingJobID == this.printingJobID.value) {
                this.printingJobCurrent = printingJob;
            }
        }

        // TODO replace with search in DB for RawData (by printingJobCurrent.printingJobID)
        let qualityReportRawData = {
            "peakPressure":Math.random()*3000,
            "peakTemperature": Math.random()*800
        };

        this.current_db_id =(this.allQualityReportRawData).length;
        this.current_db_id ++;

        this.qualityReportRawDataObj = {
            $class: "org.usecase.printer.QualityReportRawData",
            "printingJob": 'resource:org.usecase.printer.PrintingJob#'+this.printingJobCurrent.printingJobID,
            "qualityReportRawID":"QREPRAW_" + this.current_db_id,
            "encryptedReport": JSON.stringify(qualityReportRawData),
        };

        return this.serviceQualityReportRawData.addAsset(this.qualityReportRawDataObj)
            .toPromise()
            .then(() => {
                this.errorMessage = null;
                this.progressMessage = null;
                this.successMessage = 'QualityReportRawData added successfully for Manufacturer.';
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


    uploadQualityReport(form: any){

        for (const printingJob of this.allPrintingJobs) {
            if (printingJob.printingJobID == this.printingJobID.value) {
                this.printingJobCurrent = printingJob;
            }
        }
        for (const printer of this.allPrinters) {
            debugger;
            if (printer.stakeholderID == this.printingJobCurrent.printer.split("#")[1]) {
                this.printer = printer;
                debugger;
            }
        }

        // TODO Password first is encrypted with Manufacturer PubKey then with EnduserPubKey. encrypt qualityReportRawData with this
        let password = "";

        let qualityReportRawData = {
            "peakPressure":Math.random()*3000,
            "peakTemperature": Math.random()*800
        };

        // TODO save this in Mongodb
        let qualityReportRawDataObj = {
            "qualityReportRawData": qualityReportRawData,
            "printingJob": this.printingJobCurrent.printingJobID
        };

        this.current_db_id =(this.allQualityReports).length;
        this.current_db_id ++;
        this.qualityReportObj = {
            "$class": "org.usecase.printer.QualityReport",
            "qualityReportID":"QREP_" + this.current_db_id,
            "password": sha512(JSON.stringify(qualityReportRawData)),
            "databaseHash": sha512(Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 255)),
            "owner": this.printer.printerManufacturer,
            "printingJob": "resource:org.usecase.printer.PrintingJob#"+this.printingJobCurrent.printingJobID,
        };
        return this.serviceQualityReport.addAsset(this.qualityReportObj)
            .toPromise()
            .then(() => {
                debugger;
                this.errorMessage = null;
                this.progressMessage = null;
                this.successMessage = 'QualityReport added successfully. Reloading...';
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
            });
    }

  	execute(form: any){
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
