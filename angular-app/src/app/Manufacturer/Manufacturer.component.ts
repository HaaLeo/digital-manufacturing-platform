import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ManufacturerService } from './Manufacturer.service';
import 'rxjs/add/operator/toPromise';

@Component({
	selector: 'app-Manufacturer',
	templateUrl: './Manufacturer.component.html',
	styleUrls: ['./Manufacturer.component.css'],
  	providers: [ManufacturerService]
})
export class ManufacturerComponent {
  myForm: FormGroup;

  private allManufacturers;
  private manufacturer;
  private currentId;
  private errorMessage;
  private progressMessage;
  private successMessage;

  private current_db_id;

  stakeholderID = new FormControl("", Validators.required);
  pubKey = new FormControl("", Validators.required);
  name = new FormControl("", Validators.required);

  constructor(private serviceManufacturer:ManufacturerService, fb: FormBuilder) {
    this.myForm = fb.group({
          stakeholderID:this.stakeholderID,
          pubKey:this.pubKey,
          name:this.name
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  resetForm(): void{
    this.myForm.setValue({
          "stakeholderID":null,
          "pubKey":null,
          "name":null
      });
  }

  //allow update name of Manufacturer
  updateManufacturer(form: any): Promise<any> {
    this.progressMessage = 'Please wait... ';
    this.manufacturer = {
      $class: "org.usecase.printer.Manufacturer",
            "pubKey":this.pubKey.value,
            "name":this.name.value
    };
    return this.serviceManufacturer.updateManufacturer(form.get("stakeholderID").value,this.manufacturer)
		.toPromise()
		.then(() => {
      this.errorMessage = null;
      this.progressMessage = null;
      this.successMessage = 'Manufacturer updated successfully. Refreshing page...'
      location.reload();
		})
		.catch((error) => {
            if(error == 'Server error'){
              this.progressMessage = null;
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
      else if(error == '404 - Not Found'){
        this.progressMessage = null;
  			this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
        this.progressMessage = null;
				this.errorMessage = error;
			}
    });
  }

  //delete Manufacturer and the cash assets associated to it
  deleteManufacturer(): Promise<any> {
    this.progressMessage = 'Please wait... ';
    return this.serviceManufacturer.deleteManufacturer(this.currentId)
		.toPromise()
		.then(() => {
      this.errorMessage = null;
      this.progressMessage = null;
      this.successMessage = 'Manufacturer deleted successfully. Refreshing page...'
      location.reload();
		})
		.catch((error) => {
    if(error == 'Server error'){
        this.progressMessage = null;
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if(error == '404 - Not Found'){
        this.progressMessage = null;
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
        this.progressMessage = null;
				this.errorMessage = error;
			}
    });
  }

  setId(id: any): void{
    this.currentId = id;
  }

  getForm(id: any): Promise<any>{
    return this.serviceManufacturer.getManufacturer(id)
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      let formObject = {
            "stakeholderID":null,
            "pubKey":null,
            "name":null
      };
        if(result.stakeholderID){
          formObject.stakeholderID = result.stakeholderID;
        }else{
          formObject.stakeholderID = null;
        }

        if(result.pubKey){
            formObject.pubKey = result.pubKey;
          }else{
            formObject.pubKey = null;
          }

        if(result.name){
          formObject.name = result.name;
        }else{
          formObject.name = null;
        }
      this.myForm.setValue(formObject);
    })
    .catch((error) => {
        if(error == 'Server error'){
          this.progressMessage = null;
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
          this.progressMessage = null;
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
          this.progressMessage = null;
            this.errorMessage = error;
        }
    });
  }

  //load all Manufacturers and the cash assets associated to them
  loadAll(): Promise<any>  {
    //retrieve all manufacturers
    let manufacturerList = [];
    return this.serviceManufacturer.getAllManufacturers()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(manufacturer => {
        manufacturerList.push(manufacturer);
      });
      this.allManufacturers = manufacturerList;
      if (0 < manufacturerList.length) {
        this.current_db_id = manufacturerList[manufacturerList.length - 1].stakeholderID.substr(2)
      } else {
        this.current_db_id = 0
      }
    });
  }

  //add Manufacturer participant
  addManufacturer(form: any): Promise<any> {
    this.progressMessage = 'Please wait... ';
    return this.createAssetsManufacturer()
      .then(() => {
        this.errorMessage = null;
        this.progressMessage = null;
        this.successMessage = 'Manufacturer added successfully. Refreshing page...';
        this.myForm.setValue({
            "stakeholderID":null,
            "pubKey":null,
            "name":null
        });
      })
    .catch((error) => {
        if(error == 'Server error'){
          this.progressMessage = null;
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if (error == '500 - Internal Server Error') {
          this.progressMessage = null;
          this.errorMessage = "Input error";
        }
        else{
          this.progressMessage = null;
            this.errorMessage = error;
        }
    });
  }

  //create cash asset associated with the Manufacturer, followed by the Manufacturer
  createAssetsManufacturer(): Promise<any> {
    this.current_db_id++;
    this.manufacturer = {
      $class: "org.usecase.printer.Manufacturer",
          "stakeholderID":"M_" + this.current_db_id,
          "pubKey":this.pubKey.value,
          "name":this.name.value
      };
    return this.serviceManufacturer.addManufacturer(this.manufacturer)
            .toPromise()
            .then(() => {
                location.reload();
            });
  }
}
