import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { FileuploadComponent } from "../fileupload/fileupload.component";
import { QualityRequirementService } from "./QualityRequirement.service";
import { QualityRequirement } from '../org.usecase.printer';

@Component({
    selector: 'app-quality-requirement',
    templateUrl: './QualityRequirement.component.html',
    styleUrls: ['./QualityRequirement.component.css'],
    providers: [QualityRequirementService]
})
export class QualityRequirementComponent implements OnInit {

    @ViewChild(FileuploadComponent)
    private fileUploadComponent: FileuploadComponent;

    myForm: FormGroup;

    private errorMessage;
    private progressMessage;
    private successMessage;
    private allEndusers;
    private allPrinters;
    private current_db_id;
    private asset;
    private allAssets;
    private printer;


    qualityRequirementID = new FormControl("", Validators.required);
    txID = new FormControl("", Validators.required);
    owner = new FormControl("", Validators.required);
    name = new FormControl("", Validators.required);
    printerID = new FormControl("", Validators.required);

    constructor(private serviceQualityRequirement: QualityRequirementService, fb: FormBuilder) {
        this.myForm = fb.group({
            qualityRequirementID: this.qualityRequirementID,
            txID: this.txID,
            name: this.name,
            owner: this.owner,
            printerID: this.printerID,
        });
    };

    ngOnInit(): void {
        this.loadAll().then(() => {
          this.load_OnlyEndusers();
        }).then(() => {
          this.load_OnlyPrinters();
        });
    }

    //Get all Endusers
    load_OnlyEndusers(): Promise<any> {
        let tempList = [];
        return this.serviceQualityRequirement.getAllEndusers()
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

    //Get all Printers
    load_OnlyPrinters(): Promise<any> {
      let tempList = [];
      return this.serviceQualityRequirement.getAllPrinters()
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

    //Get all QualityRequirement Assets and the Designers associated to them
    loadAll(): Promise<any> {
        //retrieve all QualityRequirements
        let tempList = [];
        return this.serviceQualityRequirement.getAll()
            .toPromise()
            .then((result) => {
                this.errorMessage = null;
                result.forEach(qualityRequirement => {
                    tempList.push(qualityRequirement);
                });
            })
            .then(() => {
                for (let qualityRequirement of tempList) {
                    var splitted_ownerID = qualityRequirement.owner.split("#", 2);
                    var ownerID = String(splitted_ownerID[1]);
                    this.serviceQualityRequirement.getEnduser(ownerID)
                        .toPromise()
                        .then((result) => {
                            this.errorMessage = null;
                            if (result.firstName) {
                                qualityRequirement.firstName = result.firstName;
                            }
                            if (result.lastName) {
                                qualityRequirement.lastName = result.lastName;
                            }
                        });
                }
                this.allAssets = tempList;
                if (0 < tempList.length) {
                    this.current_db_id = tempList[tempList.length - 1].qualityRequirementID.substr(2);
                } else {
                    this.current_db_id = 0;
                }
            });
    }


    // Method called when an End User wants to upload a new QualityRequirement Asset
    addAsset(form: any) {
      for (let printer of this.allPrinters) {
        if (printer.stakeholderID == this.printerID.value) {
          this.printer = printer;

          let pubKey = this.printer.pubKey;
          let newPubKey = pubKey.slice(38, 1721);
          let newPubKey2 = newPubKey.split(" ").join("\n");
          let newPubKey3 = `-----BEGIN PGP PUBLIC KEY BLOCK-----\nVersion: OpenPGP.js v3.0.12\nComment: https://openpgpjs.org\n\n` + newPubKey2;
          let newPubKey4 = newPubKey3 + `\n-----END PGP PUBLIC KEY BLOCK-----`;

          this.progressMessage = 'Please wait... ';
          let owner = this.owner.value;
          let name = this.name.value;

          this.fileUploadComponent.encryptFile(newPubKey4)
          .then(encryptedFile => {
            this.fileUploadComponent.postTextToIPFS(encryptedFile)
          })
          .then(ipfsHash => {
            console.log('Uploaded quality requirement to ipfs. Returned hash: ' + ipfsHash);
            this.fileUploadComponent.postKeyToBCDB(ipfsHash, name, owner)
                .then(txId => {
                    console.log('Added ipfs to BCDB. TxId: ' + txId);
                    this.current_db_id++;
                    let currentChecksum = this.fileUploadComponent.getChecksum();
                    this.asset = {
                        $class: "org.usecase.printer.QualityRequirement",
                        "qualityRequirementID": "QReq_" + this.current_db_id,
                        "txID": txId,
                        "name": this.name.value,
                        "owner": this.owner.value,
                        "printerID": this.printerID.value
                    };
                    this.myForm.setValue({
                        "qualityRequirementID": null,
                        "txID": null,
                        "name": null,
                        "owner": null,
                        "printerID": null
                    });
                    return this.serviceQualityRequirement.addAsset(this.asset)
                        .toPromise()
                        .then(() => {
                            this.errorMessage = null;
                            this.progressMessage = null;
                            this.successMessage = 'Quality Requirement added successfully. Refreshing page...';
                            this.myForm.setValue({
                                "qualityRequirementID": null,
                                "txID": null,
                                "name": null,
                                "owner": null,
                                "printerID": null
                            });
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
                });


          })
          .catch(error => {
            console.error(error);
          })
        }
      }
    }

    //Retrieve a QualityRequirement with a certain id and printingJob its values to the Form Object
    getForm(id: any): Promise<any> {
        return this.serviceQualityRequirement.getAsset(id)
            .toPromise()
            .then((result: QualityRequirement) => {
                this.errorMessage = null;
                let formObject = {
                    "qualityRequirementID": null,
                    "txID": null,
                    "name": null,
                    "owner": null,
                    "printerID": null
                };
                if (result.qualityRequirementID) {
                    formObject.qualityRequirementID = result.qualityRequirementID;
                } else {
                    formObject.qualityRequirementID = null;
                }

                if (result.txID) {
                    formObject.txID = result.txID;
                } else {
                    formObject.txID = null;
                }

                if (result.owner) {
                    formObject.owner = result.owner;
                } else {
                    formObject.owner = null;
                }

                if (result.name) {
                    formObject.name = result.name;
                } else {
                    formObject.name = null;
                }
                this.myForm.setValue(formObject);
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

    // Reset all Value incurrently saved in the Form Object
    resetForm(): void {
        this.myForm.setValue({
            "qualityRequirementID": null,
            "name": null,
            "txID": null,
            "owner": null,
            "printerID": null
        });
    }
}
