import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PrinterService } from './Printer.service';
import 'rxjs/add/operator/toPromise';

@Component({
	selector: 'app-Printer',
	templateUrl: './Printer.component.html',
	styleUrls: ['./Printer.component.css'],
  	providers: [PrinterService]
})
export class PrinterComponent {

  myForm: FormGroup;

  private allPrinters;
  private printer;
  private currentId;
  private errorMessage;

  
    stakeholderID = new FormControl("", Validators.required);
    pubKey = new FormControl("", Validators.required);
    name = new FormControl("", Validators.required);
  

  constructor(private servicePrinter:PrinterService, fb: FormBuilder) {
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

  //allow update name of Printer
  updatePrinter(form: any): Promise<any> {
    
    console.log("update check");
    this.printer = {
      $class: "org.usecase.printer.Printer",  
            "pubKey":this.pubKey.value,        
            "name":this.name.value
    };

    return this.servicePrinter.updatePrinter(form.get("stakeholderID").value,this.printer)
		.toPromise()
		.then(() => {
      this.errorMessage = null;
      location.reload();
		})
		.catch((error) => {
            if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
            else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
				this.errorMessage = error;
			}
    });
  }

  //delete Printers and the cash assets associated to it
  deletePrinter(): Promise<any> {
    return this.servicePrinter.deletePrinter(this.currentId)
		.toPromise()
		.then(() => {
      this.errorMessage = null;
      console.log("Deleted")
      location.reload();
		})
		.catch((error) => {
            if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
				this.errorMessage = error;
			}
    });
  }

  setId(id: any): void{
    this.currentId = id;
  }

  getForm(id: any): Promise<any>{

    return this.servicePrinter.getPrinter(id)
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
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });

  }


  loadAll_OnlyPrinters(): Promise<any> {
    let tempList = [];
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
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });
  }

  //load all Printers and the cash assets associated to them 
  loadAll(): Promise<any>  {
    
    //retrieve all printers
    let printerList = [];
    return this.servicePrinter.getAllPrinters()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(printer => {
          console.log(printer);
        printerList.push(printer);
      });     
      this.allPrinters = printerList;
    });
  }

  //add Printer participant
  addPrinter(form: any): Promise<any> {

    return this.createAssetsPrinter()
      .then(() => {           
        this.errorMessage = null;
        this.myForm.setValue({
            "stakeholderID":null,
            "pubKey":null,
            "name":null
        });
      })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if (error == '500 - Internal Server Error') {
          this.errorMessage = "Input error";
        }
        else{
            this.errorMessage = error;
        }
    });
  }

  //create cash asset associated with the Printer, followed by the Printer
  createAssetsPrinter(): Promise<any> {

    this.printer = {
      $class: "org.usecase.printer.Printer",
          "stakeholderID":this.stakeholderID.value,
          "pubKey":this.pubKey.value,
          "name":this.name.value

      };    

    return this.servicePrinter.addPrinter(this.printer)
            .toPromise()
            .then(() => {
                console.log("created asset");
                location.reload();
            });     
  }
}