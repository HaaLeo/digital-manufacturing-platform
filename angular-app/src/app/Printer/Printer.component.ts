import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl, ValidationErrors } from '@angular/forms';
import { PrinterService } from './Printer.service';
import 'rxjs/add/operator/toPromise';
import { ManufacturerService } from "../Manufacturer/Manufacturer.service";

@Component({
  selector: 'app-Printer',
  templateUrl: './Printer.component.html',
  styleUrls: ['./Printer.component.css'],
  providers: [PrinterService, ManufacturerService]
})
export class PrinterComponent {
  myForm: FormGroup;

  private allPrinters;
  private allManufacturers;
  private printer;
  private currentId;
  private errorMessage;
  private progressMessage;
  private successMessage;

  private current_db_id;

  stakeholderID = new FormControl("", Validators.required);
  pubKey = new FormControl("", this.keyValidation);
  name = new FormControl("", Validators.required);
  printerManufacturer = new FormControl("", Validators.required);

  constructor(private servicePrinter: PrinterService, private serviceManufacturer: ManufacturerService, fb: FormBuilder) {
    this.myForm = fb.group({
      stakeholderID: this.stakeholderID,
      pubKey: this.pubKey,
      name: this.name,
      printerManufacturer: this.printerManufacturer
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  resetForm(): void {
    this.myForm.setValue({
      "stakeholderID": null,
      "pubKey": null,
      "name": null,
      "printerManufacturer": null
    });
  }

  //allow update name of Printer
  updatePrinter(form: any): Promise<any> {
    this.progressMessage = 'Please wait... ';
    this.printer = {
      $class: "org.usecase.printer.Printer",
      "pubKey": this.pubKey.value,
      "name": this.name.value,
      "printerManufacturer": this.printerManufacturer.value

    };
    return this.servicePrinter.updatePrinter(form.get("stakeholderID").value, this.printer)
      .toPromise()
      .then(() => {
        this.errorMessage = null;
        this.progressMessage = null;
        this.successMessage = 'Printer updated successfully. Refreshing page...';
        location.reload();
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

  //delete Printers and the cash assets associated to it
  deletePrinter(): Promise<any> {
    this.progressMessage = 'Please wait... ';
    return this.servicePrinter.deletePrinter(this.currentId)
      .toPromise()
      .then(() => {
        this.errorMessage = null;
        this.progressMessage = null;
        this.successMessage = 'Printer deleted successfully. Refreshing page...';
        location.reload();
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

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {
    return this.servicePrinter.getPrinter(id)
      .toPromise()
      .then((result) => {
        this.errorMessage = null;
        let formObject = {
          "stakeholderID": null,
          "pubKey": null,
          "name": null,
          "printerManufacturer": null

        };
        if (result.stakeholderID) {
          formObject.stakeholderID = result.stakeholderID;
        } else {
          formObject.stakeholderID = null;
        }

        if (result.pubKey) {
          formObject.pubKey = result.pubKey;
        } else {
          formObject.pubKey = null;
        }

        if (result.name) {
          formObject.name = result.name;
        } else {
          formObject.name = null;
        }

        if (result.printerManufacturer) {
          formObject.printerManufacturer = result.printerManufacturer;
        } else {
          formObject.printerManufacturer = null;
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

  //load all Printers and the cash assets associated to them
  loadAll(): Promise<any> {
    //retrieve all printers
    let manufacturerList = [];
    let printerList = [];

    this.serviceManufacturer.getAllManufacturers()
      .toPromise()
      .then((result) => {
        this.errorMessage = null;
        result.forEach(manufacturer => {
          manufacturerList.push(manufacturer);
        });
        this.allManufacturers = manufacturerList;
        if (0 < manufacturerList.length) {
          this.current_db_id = manufacturerList[manufacturerList.length - 1].stakeholderID.substr(2);
        } else {
          this.current_db_id = 0;
        }
      });

    return this.servicePrinter.getAllPrinters()
      .toPromise()
      .then((result) => {
        this.errorMessage = null;
        result.forEach(printer => {
          printerList.push(printer);
        });
        this.allPrinters = printerList;
        if (0 < printerList.length) {
          this.current_db_id = printerList[printerList.length - 1].stakeholderID.substr(2);
        } else {
          this.current_db_id = 0;
        }
      });
  }

  //add Printer participant
  addPrinter(form: any): Promise<any> {
    this.progressMessage = 'Please wait... ';
    return this.createAssetsPrinter()
      .then(() => {
        this.errorMessage = null;
        this.progressMessage = null;
        this.successMessage = 'Printer added successfully. Refreshing page...';
        this.myForm.setValue({
          "stakeholderID": null,
          "pubKey": null,
          "name": null,
          "printerManufacturer": null
        });
      })
      .catch((error) => {
        if (error == 'Server error') {
          this.progressMessage = null;
          this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if (error == '500 - Internal Server Error') {
          this.progressMessage = null;
          this.errorMessage = "Input error";
        }
        else {
          this.progressMessage = null;
          this.errorMessage = error;
        }
      });
  }

  //create cash asset associated with the Printer, followed by the Printer
  createAssetsPrinter(): Promise<any> {
    this.current_db_id++;
    this.printer = {
      $class: "org.usecase.printer.Printer",
      "stakeholderID": "P_" + this.current_db_id,
      "pubKey": this.pubKey.value,
      "name": this.name.value,
      "printerManufacturer": this.printerManufacturer.value

    };
    return this.servicePrinter.addPrinter(this.printer)
      .toPromise()
      .then(() => {
        location.reload();
      });
  }

  private keyValidation(c: AbstractControl): ValidationErrors | null {
    let result: ValidationErrors = null;
    if (c.value) {
      const value: string = c.value.toString();
      if (!value.startsWith('-----BEGIN PGP PUBLIC KEY BLOCK-----')
        || !value.endsWith('-----END PGP PUBLIC KEY BLOCK-----')) {
        result = {
          'invalid Key': 'Ensure the key starts with "-----BEGIN PGP PUBLIC KEY BLOCK-----" \
          and ends with "-----END PGP PUBLIC KEY BLOCK-----"'
        };
      }
    } else {
      result = {
        'invalid Key': 'The key must not be empty.'
      };
    }

    return result;
  }
}
