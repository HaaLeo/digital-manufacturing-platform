import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { BuyAssetTRService } from './BuyAssetTR.service';
import { Printer, PrintingJob, QualityReport, QualityReportRaw, Stakeholder, QualityRequirement, Enduser} from "../org.usecase.printer";
import { QualityReportService } from "../QualityReport/QualityReport.service";
import { PrinterService } from "../Printer/Printer.service";
import { QualityReportRawService } from "../QualityReportRaw/QualityReportRaw.service";
import { FileuploadComponent } from '../fileupload/fileupload.component';
import { QualityRequirementService } from '../QualityRequirement/QualityRequirement.service';

import request from "request";
import bodyParser from "body-parser";
import {ManufacturerService} from "../Manufacturer/Manufacturer.service";

declare function require(name: string);
let sha512 = require('js-sha512');

var url = "http://localhost:3004/api/";

@Component({
    selector: 'app-BuyAssetTR',
    templateUrl: './BuyAssetTR.component.html',
    styleUrls: ['./BuyAssetTR.component.css'],
    providers: [BuyAssetTRService, QualityReportService, PrinterService, QualityReportRawService,
        QualityRequirementService, ManufacturerService]
})

export class BuyAssetTRComponent {
    myForm: FormGroup;
    printingJobID = new FormControl("", Validators.required);

    private transactionFrom;
    private errorMessage;
    private progressMessage;
    private successMessage;
    private allEndusers;
    private allPrintingJobs;
    private allPrinters;
    private allQualityRequirements: QualityRequirement[];
    private allQualityReports;
    private allQualityReportRawData;
    private allManufacturers;
    private printer;

    private printingJobCurrent: PrintingJob;
    private qualityReportCurrent;
    private manufacturerCurrent;
    private qualityRequirementCurrent;
    private qualityReportRawDataObj;
    private confirmTransactionObj;
    private qualityReportObj;
    private transactionID;
    private selectedJob;
    private evaluateReportObj;
    private current_db_id;

    private plainTextPswd;
    private encryptedReportData;
    private encryptedPassword;

    private fileHandler;

    constructor(private serviceTransaction: BuyAssetTRService, fb: FormBuilder,
        private serviceQualityReport: QualityReportService,
        private serviceQualityReportRawData: QualityReportRawService,
        private servicePrinter: PrinterService,
        private serviceQualityRequirement: QualityRequirementService,
				private serviceManufacturer: ManufacturerService,
				private http: HttpClient) {
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
        this.loadAllQualityReportRawData();
        this.loadAllQualityRequirements();
        this.loadAllManufacturers();
        this.loadAllEndUsers();
    }

    //Makes random string for Quality Report encryption
    makePassword() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 20; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
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

    // Get All End users
    loadAllEndUsers(): Promise<any> {
      let tempList = [];
      return this.serviceTransaction.getAllEndusers()
        .toPromise()
        .then((result) => {
          this.errorMessage = null;
          result.forEach(enduser => {
            tempList.push(enduser);
          });
          this.allEndusers = tempList;
        })
        .catch((error) => {
          if (error == 'Server error') {
            this.progressMessage = null;
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
          }
          else if (error == '404 - Not Found') {
            this.progressMessage = null;
            this.errorMessage = "404 - Could not find API route. Please check your available APIs.";
          }
          else {
            this.progressMessage = null;
            this.errorMessage = error;
          }
        });
    }


    async evaluateReport(form: any) {
      this.successMessage = null;
      this.loadAllQualityReports();

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

        //const fileHandler = new FileuploadComponent();
        this.fileHandler = new FileuploadComponent();

        const ipfsKey = (await this.fileHandler.getBCDB(this.qualityRequirementCurrent.txID)).data.asset.key;

        /*
        const qualityRequirementFile = await fileHandler.getFileFromIPFS(
            ipfsKey,
            this.qualityRequirementCurrent.name);

        const requirementObj = JSON.parse(await fileHandler.readAsTextAsync(qualityRequirementFile));
        */

        const encryptedFile = await this.fileHandler.getTextFromIPFS(ipfsKey);
        console.log("ENCRYPTED FILE" + encryptedFile);
        const decryptedFile = await this.fileHandler.decryptTextWithPrivKey(encryptedFile, this.serviceTransaction.returnPrinterPrivateKey());
        console.log("DECRYPTED FILE" + decryptedFile);
        const requirementObj = JSON.parse(decryptedFile);
        console.log("REQUIREMENT OBJ" + requirementObj);

        // Ensure the QR JSON uploaded has that properties
        let peakTemperature = requirementObj.peakTemperature;
        let peakPressure = requirementObj.peakPressure;

        for (const qualityReport of this.allQualityReports) {
            if (qualityReport.printingJob == "resource:org.usecase.printer.PrintingJob#" + this.printingJobCurrent.printingJobID) {
                this.qualityReportCurrent = qualityReport;
            }
        }

				// Retrieving report data from MongoDB
				console.log('Retrieving report from Job ID: ' + this.printingJobID.value);
				this.http.get('http://localhost:3004/api/getData/' + this.printingJobID.value).subscribe(data => {
					let temperature = data[0]["qualityReportRawData"]["peakTemperature"];
	        let pressure = data[0]["qualityReportRawData"]["peakPressure"];
					console.log("Temp: " + temperature + "   Pressure: " + pressure);

					this.evaluateReportObj = {
	            $class: "org.usecase.printer.EvaluateReport",
	            "temperature": temperature,
	            "pressure": pressure,
	            "peakTemperature": peakTemperature,
	            "peakPressure": peakPressure,
	            "printingJob": 'resource:org.usecase.printer.PrintingJob#'+this.printingJobCurrent.printingJobID,
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
    		});
    }

    async transferRawData(form: any) {
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
          if ("resource:org.usecase.printer.Manufacturer#" + manufacturer.stakeholderID == this.printer.printerManufacturer) {
            this.manufacturerCurrent = "resource:org.usecase.printer.Manufacturer#" + manufacturer.stakeholderID;
          }
        }

        for (const endUser of this.allEndusers) {
          if ("resource:org.usecase.printer.Enduser#" + endUser.stakeholderID == this.printingJobCurrent.buyer.toString()) {
          }
        }

        // Search MongoDB for raw data
				console.log('Searching MongoDB for job ID: ' + this.printingJobCurrent.printingJobID);
				this.http.get('http://localhost:3004/api/getData/' + this.printingJobCurrent.printingJobID).subscribe(data => {

					let qualityReportRawData = data[0]["qualityReportRawData"];

					console.log('Quality Report Raw Data: ' + JSON.stringify(qualityReportRawData));

                this.current_db_id =(this.allQualityReportRawData).length;
      	        this.current_db_id ++;

      	        let stakeholderObjs = [];
      	        stakeholderObjs.push(this.manufacturerCurrent);

      	        this.qualityReportRawDataObj = {
                      $class: "org.usecase.printer.QualityReportRaw",
                      "printingJob": 'resource:org.usecase.printer.PrintingJob#' + this.printingJobCurrent.printingJobID,
                      "qualityReportRawID": "QREPRAW_" + this.current_db_id,
                      "encryptedReport": this.encryptedReportData,
                      "accessPermissionCode": this.encryptedPassword,
                      "stakeholder": stakeholderObjs
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
              });
    }

    uploadQualityReport(form: any) {
      let manufacturerPubKey;
      let endUserPubKey;

      this.fileHandler = new FileuploadComponent();

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
            if ("resource:org.usecase.printer.Manufacturer#" + manufacturer.stakeholderID == this.printer.printerManufacturer) {
                manufacturerPubKey = manufacturer.pubKey;
            }
        }

        for (const endUser of this.allEndusers) {
          if ("resource:org.usecase.printer.Enduser#" + endUser.stakeholderID == this.printingJobCurrent.buyer.toString()) {
            endUserPubKey = endUser.pubKey;
          }
        }

        // TODO Password first is encrypted with Manufacturer PubKey then with EnduserPubKey. encrypt qualityReportRawData with this
        let qualityReportRawData = {
            "peakPressure": Math.random() * 3000,
            "peakTemperature": Math.random() * 800
        };

        // Save data in MongoDB
				const req = this.http.post('http://localhost:3004/api/addData', {
      		jobID: this.printingJobCurrent.printingJobID,
      		qualityReportRawData: qualityReportRawData,
    		}).subscribe(
        	res => {
          	console.log("Saved raw data in MongoDB...");

        	},
        	err => {
          	console.log("Error occured saving data to MongoDB...");
        });

        let qualityReportRawDataObj = {
            "qualityReportRawData": qualityReportRawData,
            "printingJob": this.printingJobCurrent.printingJobID
        };

        this.current_db_id = (this.allQualityReports).length;
        this.current_db_id++;

        // Manages encryption of raw data with password

        console.log('Quality Report Raw Data: ' + JSON.stringify(qualityReportRawData));

        this.plainTextPswd = this.makePassword();
        console.log("PLAIN TEXT PSWD: " + this.plainTextPswd);

        manufacturerPubKey = manufacturerPubKey.slice(92, 4599);
        manufacturerPubKey = manufacturerPubKey.split(" ").join("\n");
        manufacturerPubKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----\nVersion: OpenPGP v2.0.8\nComment: https://sela.io/pgp/\n\n` + manufacturerPubKey + `\n-----END PGP PUBLIC KEY BLOCK-----`;

        endUserPubKey = endUserPubKey.slice(92, 4599);
        endUserPubKey = endUserPubKey.split(" ").join("\n");
        endUserPubKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----\nVersion: OpenPGP v2.0.8\nComment: https://sela.io/pgp/\n\n` + endUserPubKey + `\n-----END PGP PUBLIC KEY BLOCK-----`;

        // Encrypt the raw quality report data with the password
        this.fileHandler.encryptTextWithPassword(this.plainTextPswd, JSON.stringify(qualityReportRawData))
        .then(encryptedData => {
          this.encryptedReportData = encryptedData;
          this.encryptedReportData = this.encryptedReportData.substr(92);
          this.encryptedReportData = this.encryptedReportData.slice(0, -25);
          this.encryptedReportData = this.encryptedReportData.split(" ").join("\n");
          this.encryptedReportData = `-----BEGIN PGP MESSAGE-----\nVersion: OpenPGP v2.0.8\nComment: https://sela.io/pgp/\n\n` + this.encryptedReportData + `\n-----END PGP MESSAGE-----`;
          // Encrypt the password with the manufacturer's public key
          this.fileHandler.encryptText(manufacturerPubKey, this.plainTextPswd)
          .then(encryptedWithManuf => {
            // Encrypt the response with the End User's public key
            this.fileHandler.encryptText(endUserPubKey, encryptedWithManuf)
            .then(encryptedWithManufEnduser => {
              this.encryptedPassword = encryptedWithManufEnduser;
              console.log("THIS ENCRYPTED PSWD: " + this.encryptedPassword);
              //This one sent to customer
              this.qualityReportObj = {
                  "$class": "org.usecase.printer.QualityReport",
                  "qualityReportID": "QREP_" + this.current_db_id,
                  "databaseHash": sha512(Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 255)),
                  "owner": this.printer.printerManufacturer,
                  "printingJob": "resource:org.usecase.printer.PrintingJob#" + this.printingJobCurrent.printingJobID,
                  "accessPermissionCode": this.encryptedPassword,
              };
              return this.serviceQualityReport.addAsset(this.qualityReportObj)
                  .toPromise()
                  .then(() => {
                      this.errorMessage = null;
                      this.progressMessage = null;
                      this.successMessage = 'QualityReport added successfully.';
                      //location.reload();
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
            })
            .catch(error => {
              console.log(error);
            });
          })
          .catch(error => {
            console.log(error);
          });
        })
        .catch(error => {
          console.error(error);
        });
    }

  	execute(form: any){
			this.progressMessage = 'Please wait... ';
  	  console.log(this.allPrintingJobs);
			for (const printingJob of this.allPrintingJobs) {
      	if (printingJob.printingJobID == this.printingJobID.value) {
        	this.printingJobCurrent = printingJob;
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
