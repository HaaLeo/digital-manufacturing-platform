import { Component, OnInit } from '@angular/core';
import { QualityReport, QualityReportRaw, PrintingJob } from '../org.usecase.printer';
import { QualityReportRawService } from './QualityReportRaw.service';
import {DataAnalystService} from "../DataAnalyst/DataAnalyst.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {EvaluationResultService} from "../EvaluationResult/EvaluationResult.service";
import {any} from "codelyzer/util/function";
import { FileuploadComponent } from '../fileupload/fileupload.component';
import { QualityReportService } from "../QualityReport/QualityReport.service";

@Component({
  selector: 'app-quality-report-raw',
  templateUrl: './QualityReportRaw.component.html',
  styleUrls: ['./QualityReportRaw.component.css'],
  providers: [QualityReportRawService, DataAnalystService, EvaluationResultService, QualityReportService]
})



export class QualityReportRawComponent implements OnInit {
    myForm: FormGroup;

  private errorMessage;
  private progressMessage;
  private successMessage;
  private currentAsset;

  private allAccessibleQualityReportsRaw = [];
  private allInaccessibleQualityReportsRaw = [];
  private allAnalysts;
  private allPrintingJobs;
  private allQualityReports;
  private allEvaluationResults: any;
  private qualityReportRawDataObj;

  private current_db_id;
    dataAnalystID = new FormControl("");
    qualityReportRawID = new FormControl("", Validators.required);
    encryptedReport = new FormControl("", Validators.required);
    formattedPrintingJob= new FormControl("", Validators.required);
    formattedStakeholders = new FormControl("", Validators.required);

  constructor(private serviceQualityReportRaw: QualityReportRawService,
              fb: FormBuilder,
              private serviceDataAnalyst: DataAnalystService,
              private serviceEvaluationResult: EvaluationResultService,
              private serviceQualityReport: QualityReportService,) {
      this.myForm = fb.group({
          qualityReportRawID: this.qualityReportRawID,
          encryptedReport: this.encryptedReport,
          formattedPrintingJob: this.formattedPrintingJob,
          formattedStakeholders: this.formattedStakeholders,
          dataAnalystID: this.dataAnalystID,
      });
  };

  ngOnInit(): void {
        this.loadAllEvaluationResults();
        this.loadAllQualityReportsRaw();
        this.loadAllDataAnalysts();
        this.loadAllPrintingJobs();
        this.loadAllQualityReports();
  }

  //Gets all raw quality reports
  loadAllQualityReportsRaw(): Promise<any> {
    //retrieve all BlueprintMaster
    let tempList = [];
    return this.serviceQualityReportRaw.getAll()
      .toPromise()
      .then((result) => {
        this.errorMessage = null;
        result.forEach(rawReport => {
          tempList.push(rawReport);
        });
      })
      .then(() => {
          let evaluationResultPrintingJobIDs = [];
          if (this.allEvaluationResults){
              for (let evaluationResult of this.allEvaluationResults) {
                  evaluationResultPrintingJobIDs.push(evaluationResult.printingJob);
              }
          }
          for (let rawReport of tempList) {
            const stakeholders = [];
            for(const stakeholder of rawReport.stakeholder) {
              var splitted_ownerID = stakeholder.split("#", 2);
               stakeholders.push(String(splitted_ownerID[1]));
            }

            rawReport.formattedStakeholders = stakeholders;
            rawReport.formattedPrintingJob = rawReport.printingJob.split("#", 2)[1];

            if (evaluationResultPrintingJobIDs){
                if (evaluationResultPrintingJobIDs.indexOf(rawReport.printingJob) > -1) {
                    this.allAccessibleQualityReportsRaw.push(rawReport);
                }
                else {
                    this.allInaccessibleQualityReportsRaw.push(rawReport);
                }
            }
            else{
                this.allInaccessibleQualityReportsRaw.push(rawReport);
            }
          }

        if (0 < tempList.length) {
          this.current_db_id = tempList[tempList.length - 1].qualityReportRawID.substr(2);
        } else {
          this.current_db_id = 0;
        }
      });
  }

  //Get all PrintingJobs
  loadAllPrintingJobs(): Promise<any> {
      const tempList = [];
      return this.serviceQualityReportRaw.getAllPrintingJobs()
          .toPromise()
          .then((result) => {
              this.errorMessage = null;
              result.forEach(printingJob => {
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

  //Get all QualityReports
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

    //Get all data analysts
    loadAllDataAnalysts(): Promise<any> {
        let tempList = [];
        return this.serviceDataAnalyst.getAllDataAnalysts()
            .toPromise()
            .then((result) => {
                this.errorMessage = null;
                result.forEach(analyst => {
                    tempList.push(analyst);
                });
                this.allAnalysts = tempList;
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

    //Get all data analysts
    loadAllEvaluationResults(): Promise<any> {
        let tempList = [];
        return this.serviceEvaluationResult.getAll()
            .toPromise()
            .then((result) => {
                this.errorMessage = null;
                result.forEach(evaluationResult => {
                    if (evaluationResult.manufacturer) {
                        tempList.push(evaluationResult);
                    }
                    });
                this.allEvaluationResults = tempList;
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

    setAsset(asset: any, printingJobs: any): void {
        this.currentAsset = asset;
    }

    //
    shareDataWithAnalyst(form: any) {
      let fileHandler = new FileuploadComponent();

      console.log("CHECKING FOR PRINTING JOB ID: " + this.currentAsset.printingJob);

      for (const printingJob of this.allPrintingJobs) {
        console.log("FOUND PRINTING JOB ID: " + printingJob.printingJobID);
          if ("resource:org.usecase.printer.PrintingJob#" + printingJob.printingJobID == this.currentAsset.printingJob) {
            console.log("CHECKING FOR QUALITY REPORT WITH PRINTING JOB: " + printingJob.printingJobID);
            for (const qualityReport of this.allQualityReports) {
              console.log("FOUND QUALITY REPORT WITH PRINTING JOB: " + qualityReport.printingJob);
              debugger;
                if (qualityReport.printingJob == this.currentAsset.printingJob) {
                    console.log("FOUND ONE");

                    //This will only work once EvaluationResult is working successfully. Needs EndUser to decrypt accessPermissionCode first
                    fileHandler.decryptTextWithPrivKey(qualityReport.accessPermissionCode, this.serviceQualityReportRaw.returnManufacturerPrivateKey())
                    .then(decryptedPassword => {
                        debugger;
                      fileHandler.decryptTextWithPassword(decryptedPassword, this.currentAsset.encryptedReport)
                      .then(decryptedReport => {
                        //Find the Analyst's PubKey
                        for (const analyst of this.allAnalysts) {
                            if (analyst.stakeholderID  == this.dataAnalystID.value) {
                              //Encrypt report with Analyst's public key
                              fileHandler.encryptText(analyst.pubKey, decryptedReport)
                              .then(encryptedReport => {
                                let stakeholderObjs = this.currentAsset.stakeholder;
                                stakeholderObjs.push(this.dataAnalystID.value);


                                this.qualityReportRawDataObj = {
                                  $class: "org.usecase.printer.QualityReportRaw",
                                  "accessPermissionCode": this.currentAsset.accessPermissionCode,
                                  "stakeholder": stakeholderObjs,
                                  "encryptedReport": encryptedReport, //now encrypted with the pubkey
                                  "printingJob": this.currentAsset.printingJob
                                };
                                return this.serviceQualityReportRaw.updateAsset(this.currentAsset.qualityReportRawID,this.qualityReportRawDataObj)
                                  .toPromise()
                                  .then(() => {
                                    this.errorMessage = null;
                                    this.progressMessage = null;
                                    this.successMessage = 'Quality Report Raw shared successfully. Refreshing page...';
                                    location.reload();
                                  })
                                  .catch((error) => {
                                    if(error == 'Server error') {
                                      this.progressMessage = null;
                                      this.errorMessage = "Could not connect to REST server. Please check your configuration details";
                                    }
                                    else if(error == '404 - Not Found') {
                                      this.progressMessage = null;
                                      this.errorMessage = "404 - Could not find API route. Please check your available APIs.";
                                    }
                                    else {
                                      this.progressMessage = null;
                                      this.errorMessage = error;
                                    }
                                  });

                              });
                            }
                        }
                      });
                    });



                    /*
                    //This will only work once EvaluationResult is working successfully. Needs EndUser to decrypt accessPermissionCode first
                    fileHandler.decryptTextWithPrivKey(qualityReport.accessPermissionCode, this.serviceQualityReportRaw.returnManufacturerPrivateKey())
                    .then(decryptedPassword => {
                        debugger;
                      fileHandler.decryptTextWithPassword(decryptedPassword, this.currentAsset.encryptedReport)
                      .then(decryptedReport => {
                        //Find the Analyst's PubKey
                        for (const analyst of this.allAnalysts) {
                            if (analyst.stakeholderID  == this.dataAnalystID.value) {
                              //Encrypt report with Analyst's public key
                              fileHandler.encryptText(analyst.pubKey, decryptedReport)
                              .then(encryptedReport => {
                                let stakeholderObjs = this.currentAsset.stakeholder;
                                stakeholderObjs.push(this.dataAnalystID.value);


                                this.qualityReportRawDataObj = {
                                  $class: "org.usecase.printer.QualityReportRaw",
                                  "accessPermissionCode": this.currentAsset.accessPermissionCode,
                                  "stakeholder": stakeholderObjs,
                                  "encryptedReport": encryptedReport, //now encrypted with the pubkey
                                  "printingJob": this.currentAsset.printingJob
                                };
                                return this.serviceQualityReportRaw.updateAsset(this.currentAsset.qualityReportRawID,this.qualityReportRawDataObj)
                                  .toPromise()
                                  .then(() => {
                                    this.errorMessage = null;
                                    this.progressMessage = null;
                                    this.successMessage = 'Quality Report Raw shared successfully. Refreshing page...';
                                    location.reload();
                                  })
                                  .catch((error) => {
                                    if(error == 'Server error') {
                                      this.progressMessage = null;
                                      this.errorMessage = "Could not connect to REST server. Please check your configuration details";
                                    }
                                    else if(error == '404 - Not Found') {
                                      this.progressMessage = null;
                                      this.errorMessage = "404 - Could not find API route. Please check your available APIs.";
                                    }
                                    else {
                                      this.progressMessage = null;
                                      this.errorMessage = error;
                                    }
                                  });

                              });
                            }
                        }
                      });
                    });
                    */
                }
            }
          }
      }
   }
}
