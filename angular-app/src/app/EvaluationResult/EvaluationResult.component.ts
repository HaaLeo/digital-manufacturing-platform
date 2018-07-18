import { Component, OnInit } from '@angular/core';
import {BlueprintMasterService} from "../BlueprintMaster/BlueprintMaster.service";
import {FileuploadComponent} from "../fileupload/fileupload.component";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {EvaluationResultService} from "./EvaluationResult.service";
import {PrintingJobService} from "../PrintingJob/PrintingJob.service";
import { QualityReportService } from "../QualityReport/QualityReport.service";

@Component({
  selector: 'app-evaluation-result',
  templateUrl: './EvaluationResult.component.html',
  styleUrls: ['./EvaluationResult.component.css'],
    providers: [EvaluationResultService, PrintingJobService, QualityReportService]
})
export class EvaluationResultComponent implements OnInit {

    myForm: FormGroup;

    private allAssets;
    private errorMessage;
    private progressMessage;
    private successMessage;

    private allDesigners;
    private allEndusers;
    private allPrinters;
    private allPrintingJobs;
    private allQualityReports;

    private current_db_id;
    private evaluationResult;
    private currentEvaluationResult;
    private currentPrintingJob;
    private currentPrinter;
    private qualityReport;
    private currentQualityReport;

    private fileHandler;

    evaluationResultID = new FormControl("", Validators.required);
    txID = new FormControl("", Validators.required);
    requirementsMet= new FormControl("", Validators.required);
    customer = new FormControl("", Validators.required);
    printingJob = new FormControl("", Validators.required);

    constructor(private serviceEvaluationResult:EvaluationResultService, fb: FormBuilder, private servicePrintingJob: PrintingJobService, private serviceQualityReport: QualityReportService,) {
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
        }).then(()=> {
            this.load_OnlyPrintingJobs();
        }).then(() => {
          this.loadAllQualityReports();
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

    //Get all Designers
    load_OnlyPrintingJobs(): Promise<any> {
        let tempList = [];
        return this.servicePrintingJob.getAllPrintingJobs()
            .toPromise()
            .then((result) => {
                this.errorMessage = null;
                result.forEach(printingJob => {
                    tempList.push(printingJob);
                });
                this.allPrintingJobs = tempList;
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
                this.allAssets = tempList;
            });
    }

    shareResult(form: any): Promise<any> {
        this.progressMessage = 'Please wait... ';

        this.fileHandler = new FileuploadComponent();

        let encryptedPassword;

        for (const evaluationResult of this.allAssets){
            if (evaluationResult.evaluationResultID == form){
                this.currentEvaluationResult = evaluationResult;
            }
        }

        for (const printingJob of this.allPrintingJobs){
            if ("resource:org.usecase.printer.PrintingJob#" + printingJob.printingJobID == this.currentEvaluationResult.printingJob){
                this.currentPrintingJob = printingJob;
            }
        }

        for (const printer of this.allPrinters){
          if ("resource:org.usecase.printer.Printer#" + printer.stakeholderID == this.currentPrintingJob.printer){
            this.currentPrinter = printer;
          }
        }

        for (const qualityReport of this.allQualityReports) {
          if ("resource:org.usecase.printer.QualityReport#" + qualityReport.qualityReportID == this.currentEvaluationResult.qualityReport) {
            encryptedPassword = qualityReport.accessPermissionCode;
            this.currentQualityReport = qualityReport;
          }
        }

        // Decrypts the encrypted password so it is now only encrypted with the Manufacturer's public key
        return this.fileHandler.decryptTextWithPrivKey(encryptedPassword, this.serviceEvaluationResult.returnEndUserPrivateKey())
        .then(decryptedPassword => {

          // Update only the accessPermissionCode in the quality report
          this.qualityReport = {
            "accessPermissionCode": decryptedPassword,
            "databaseHash": this.currentQualityReport.databaseHash,
            "owner": this.currentQualityReport.owner,
            "printingJob": this.currentQualityReport.printingJob
          };

          return this.serviceEvaluationResult.updateQualityReport(this.currentQualityReport.qualityReportID, this.qualityReport)
              .toPromise()
              .then(() => {

                // After updating Quality Report, update Evaluation Result (with the updated quality report included)
                this.evaluationResult = {
                    $class: "org.usecase.printer.EvaluationResult",
                    "txID": this.currentEvaluationResult.txID+"_",
                    "requirementsMet": this.currentEvaluationResult.requirementsMet,
                    "customer": this.currentEvaluationResult.customer,
                    "printingJob": this.currentEvaluationResult.printingJob,
                    "qualityReport": this.currentEvaluationResult.qualityReport,
                    "manufacturer": this.currentPrinter.printerManufacturer,
                };

                return this.serviceEvaluationResult.updateEvaluationResult(form,this.evaluationResult)
                    .toPromise()
                    .then(() => {
                        this.errorMessage = null;
                        this.progressMessage = null;
                        this.successMessage = 'Evaluation Result shared successfully. Refreshing page...';
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
        })
        .catch(error => {
          console.error(error);
        });
    }
}
