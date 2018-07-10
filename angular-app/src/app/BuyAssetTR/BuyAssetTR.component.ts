import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { BuyAssetTRService } from './BuyAssetTR.service';
import { Printer, PrintingJob, QualityReport, QualityReportRaw, Stakeholder, QualityRequirement } from "../org.usecase.printer";
import { QualityReportService } from "../QualityReport/QualityReport.service";
import { PrinterService } from "../Printer/Printer.service";
import { QualityReportRawService } from "../QualityReportRaw/QualityReportRaw.service";
import { FileuploadComponent } from '../fileupload/fileupload.component';
import { QualityRequirementService } from '../QualityRequirement/QualityRequirement.service';
import {ManufacturerService} from "../Manufacturer/Manufacturer.service";

declare function require(name: string);
let sha512 = require('js-sha512');

@Component({
    selector: 'app-BuyAssetTR',
    templateUrl: './BuyAssetTR.component.html',
    styleUrls: ['./BuyAssetTR.component.css'],
    providers: [BuyAssetTRService, QualityReportService, PrinterService, QualityReportRawService, QualityRequirementService, ManufacturerService]
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
    private allManufacturers;
    private allQualityRequirements: QualityRequirement[];
    private allQualityReports;
    private allQualityReportRaw;
    private printer;

    private printingJobCurrent: PrintingJob;
    private qualityReportCurrent;
    private qualityRequirementCurrent;
    private manufacturerCurrent;
    private qualityReportRawObj;
    private confirmTransactionObj;
    private qualityReportObj;
    private transactionID;
    private selectedJob;
    private evaluateReportObj;
    private current_db_id;
    private stakeholderObjs;

    constructor(private serviceTransaction: BuyAssetTRService, fb: FormBuilder,
        private serviceQualityReport: QualityReportService,
        private serviceQualityReportRaw: QualityReportRawService,
        private servicePrinter: PrinterService,
        private serviceManufacturer: ManufacturerService,
        private serviceQualityRequirement: QualityRequirementService) {
        this.myForm = fb.group({
            printingJobID: this.printingJobID,
        });
    }

    ngOnInit(): void {
        this.transactionFrom = false;
        this.loadAllPrintingJobs()
            .then(() => {
                this.transactionFrom = true;
            });
        this.loadAllQualityReports();
        this.loadAllPrinters();
        this.loadAllManufacturers();
        this.loadAllQualityReportRaw();
        this.loadAllQualityRequirements();
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
                    if (printingJob.txID != '' && !printingJob.printed)
                        tempList.push(printingJob);
                });
                this.allPrintingJobs = tempList;
            })
            .catch((error) => {
                if (error == 'Server error') {
                    this.progressMessage = null;
                    this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
                }
                else if (error == '404 - Not Found') {
                    this.progressMessage = null;
                    this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
                }
                else {
                    this.progressMessage = null;
                    this.errorMessage = error;
                }
            });
    };
    // Get All Manufacturers
    loadAllManufacturers(): Promise<any> {
        const tempList = [];
        return this.serviceManufacturer.getAllManufacturers()
            .toPromise()
            .then((result) => {
                this.errorMessage = null;
                result.forEach(manufacturer => {
                    //DISPLAY ONLY PRINTING JOBS THAT HAVEN'T PRINTED YET
                        tempList.push(manufacturer);
                });
                this.allManufacturers = tempList;
            })
            .catch((error) => {
                if (error == 'Server error') {
                    this.progressMessage = null;
                    this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
                }
                else if (error == '404 - Not Found') {
                    this.progressMessage = null;
                    this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
                }
                else {
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
                if (0 < tempList.length) {
                    this.current_db_id = tempList[tempList.length - 1];
                } else {
                    this.current_db_id = 0;
                }
            })
            .catch((error) => {
                if (error == 'Server error') {
                    this.progressMessage = null;
                    this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
                }
                else if (error == '404 - Not Found') {
                    this.progressMessage = null;
                    this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
                }
                else {
                    this.progressMessage = null;
                    this.errorMessage = error;
                }
            });
    }

    // Get all QualityReports
    loadAllQualityReportRaw(): Promise<any> {
        const tempList = [];
        return this.serviceQualityReportRaw.getAll()
            .toPromise()
            .then((result) => {
                this.errorMessage = null;
                result.forEach(rawQualityReport => {
                    tempList.push(rawQualityReport);
                });
                this.allQualityReportRaw = tempList;
                if (0 < tempList.length) {
                    this.current_db_id = tempList[tempList.length - 1];
                } else {
                    this.current_db_id = 0;
                }
            })
            .catch((error) => {
                if (error == 'Server error') {
                    this.progressMessage = null;
                    this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
                }
                else if (error == '404 - Not Found') {
                    this.progressMessage = null;
                    this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
                }
                else {
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
                if (error == 'Server error') {
                    this.progressMessage = null;
                    this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
                }
                else if (error == '404 - Not Found') {
                    this.progressMessage = null;
                    this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
                }
                else {
                    this.progressMessage = null;
                    this.errorMessage = error;
                }
            });
    }

    loadAllQualityRequirements(): Promise<any> {
        const tempList = [];
        return this.serviceQualityRequirement.getAll()
            .toPromise()
            .then((result) => {
                this.errorMessage = null;
                result.forEach(requirement => {
                    tempList.push(requirement);
                });
                this.allQualityRequirements = tempList;
            })
            .catch((error) => {
                if (error == 'Server error') {
                    this.progressMessage = null;
                    this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
                }
                else if (error == '404 - Not Found') {
                    this.progressMessage = null;
                    this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
                }
                else {
                    this.progressMessage = null;
                    this.errorMessage = error;
                }
            });
    }

    async evaluateReport(form: any) {

        // TODO read from DB
        let temperature = Math.floor(Math.random() * 300);
        let pressure = Math.floor(Math.random() * 3000);


        this.progressMessage = 'Please wait... ';
        console.log(this.allPrintingJobs);
        for (const printingJob of this.allPrintingJobs) {
            if (printingJob.printingJobID == this.printingJobID.value) {
                this.printingJobCurrent = printingJob;
            }
        }

        for (const qualityRequirement of this.allQualityRequirements) {
            if ("resource:org.usecase.printer.QualityRequirement#" + qualityRequirement.qualityRequirementID
                == this.printingJobCurrent.qualityRequirement.toString()) {
                this.qualityRequirementCurrent = qualityRequirement;
            }
        }
        const fileHandler = new FileuploadComponent();
        const ipfsKey = (await fileHandler.getBCDB(this.qualityRequirementCurrent.txID)).data.asset.key;
        const qualityRequirementFile = await fileHandler.getFileFromIPFS(
            ipfsKey,
            this.qualityRequirementCurrent.name);
        const requirementObj = JSON.parse(await fileHandler.readAsTextAsync(qualityRequirementFile));

        // Ensure the QR JSON uploaded has that properties
        let peakTemperature = requirementObj.peakTemperature;
        let peakPressure = requirementObj.peakPressure;

        for (const qualityReport of this.allQualityReports) {
            if (qualityReport.printingJob == "resource:org.usecase.printer.PrintingJob#" + this.printingJobCurrent.printingJobID) {
                this.qualityReportCurrent = qualityReport;
            }
        }

        this.evaluateReportObj = {
            $class: "org.usecase.printer.EvaluateReport",
            "temperature": temperature,
            "pressure": pressure,
            "peakTemperature": peakTemperature,
            "peakPressure": peakPressure,
            "printingJob": 'resource:org.usecase.printer.PrintingJob#' + this.printingJobCurrent.printingJobID,
            "customer": this.printingJobCurrent.buyer,
            "qualityReport": 'resource:org.usecase.printer.QualityReport#' + this.qualityReportCurrent.qualityReportID,
            "manufacturer": null
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
                if (error == 'Server error') {
                    this.progressMessage = null;
                    this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
                }
                else if (error == '404 - Not Found') {
                    this.progressMessage = null;
                    this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
                }
                else {
                    this.progressMessage = null;
                    this.errorMessage = error;
                }
            });
    }

    transferRawData(form: any) {
        for (const printingJob of this.allPrintingJobs) {
            if (printingJob.printingJobID == this.printingJobID.value) {
                this.printingJobCurrent = printingJob;
            }
        }


        for (const printer of this.allPrinters) {
            if (printer.stakeholderID == this.printingJobCurrent.printer.toString().split("#")[1]) {
                this.printer = printer;
            }
        }

        for (const manufacturer of this.allManufacturers) {
            if ("resource:org.usecase.printer.Manufacturer#"+manufacturer.stakeholderID==this.printer.printerManufacturer) {
                this.manufacturerCurrent = "resource:org.usecase.printer.Manufacturer#"+manufacturer.stakeholderID;
            }
        }

        // TODO replace with search in DB for RawData (by printingJobCurrent.printingJobID)
        let rawQualityReport = {
            "peakPressure": Math.random() * 3000,
            "peakTemperature": Math.random() * 800
        };

        this.current_db_id = (this.allQualityReportRaw).length;
        this.current_db_id++;

        this.stakeholderObjs = [];
        this.stakeholderObjs.push(this.manufacturerCurrent);
        this.qualityReportRawObj = {
            $class: "org.usecase.printer.QualityReportRaw",
            "printingJob": 'resource:org.usecase.printer.PrintingJob#' + this.printingJobCurrent.printingJobID,
            "qualityReportRawID": "QREPRAW_" + this.current_db_id,
            "encryptedReport": JSON.stringify(rawQualityReport),
            "accessPermissionCode": 'None',
            "stakeholder": this.stakeholderObjs
        };
        debugger;

        return this.serviceQualityReportRaw.addAsset(this.qualityReportRawObj)
            .toPromise()
            .then(() => {
                this.errorMessage = null;
                this.progressMessage = null;
                this.successMessage = 'QualityReportRaw added successfully for Manufacturer.';
            })
            .catch((error) => {
                if (error == 'Server error') {
                    this.progressMessage = null;
                    this.errorMessage = "Could not connect to REST server. Please check your configuration details";
                }
                else {
                    this.progressMessage = null;
                    this.errorMessage = error;
                }
            });

    }


    uploadQualityReport(form: any) {

        for (const printingJob of this.allPrintingJobs) {
            if (printingJob.printingJobID == this.printingJobID.value) {
                this.printingJobCurrent = printingJob;
            }
        }
        for (const printer of this.allPrinters) {
            if (printer.stakeholderID == this.printingJobCurrent.printer.toString().split("#")[1]) {
                this.printer = printer;
            }
        }

        // TODO Password first is encrypted with Manufacturer PubKey then with EnduserPubKey. encrypt qualityReportRaw with this
        let password = "";

        let rawQualityReport = {
            "peakPressure": Math.random() * 3000,
            "peakTemperature": Math.random() * 800
        };

        // TODO save this in Mongodb
        let qualityReportRawObj = {
            "qualityReportRaw": rawQualityReport,
            "printingJob": this.printingJobCurrent.printingJobID
        };

        this.current_db_id = (this.allQualityReports).length;
        this.current_db_id++;
        this.qualityReportObj = {
            "$class": "org.usecase.printer.QualityReport",
            "qualityReportID": "QREP_" + this.current_db_id,
            "accessPermissionCode": sha512(JSON.stringify(rawQualityReport)),
            "databaseHash": sha512(Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 255)),
            "owner": this.printer.printerManufacturer,
            "printingJob": "resource:org.usecase.printer.PrintingJob#" + this.printingJobCurrent.printingJobID,
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
                if (error == 'Server error') {
                    this.progressMessage = null;
                    this.errorMessage = "Could not connect to REST server. Please check your configuration details";
                }
                else {
                    this.progressMessage = null;
                    this.errorMessage = error;
                }
            });
    }

    execute(form: any) {
        this.progressMessage = 'Please wait... ';
        console.log(this.allPrintingJobs);
        for (const printingJob of this.allPrintingJobs) {
            if (printingJob.printingJobID == this.printingJobID.value) {
                this.printingJobCurrent = printingJob;
            }
        }

        this.confirmTransactionObj = {
            "$class": "org.usecase.printer.ConfirmTransaction",
            "printingJob": "resource:org.usecase.printer.PrintingJob#" + this.printingJobCurrent.printingJobID
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
                if (error == 'Server error') {
                    this.progressMessage = null;
                    this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
                }
                else if (error == '404 - Not Found') {
                    this.progressMessage = null;
                    this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
                }
                else {
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
