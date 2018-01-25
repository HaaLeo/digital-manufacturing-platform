import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { BuyAssetTRService } from './BuyAssetTR.service';



@Component({
	selector: 'app-BuyAssetTR',
	templateUrl: './BuyAssetTR.component.html',
	styleUrls: ['./BuyAssetTR.component.css'],
  	providers: [BuyAssetTRService]
})

export class BuyAssetTRComponent {

	// printerID = new FormControl("", Validators.required);
	// cashIncID = new FormControl("", Validators.required); 
	
	// cashDecID = new FormControl("", Validators.required);
	blueprintCopyID = new FormControl("", Validators.required);
	
	myForm: FormGroup;
	private transactionFrom;
	private errorMessage;
	private allBlueprintCopies;
	
	private blueprintCopyCurrent;
	private confirmTransactionObj;
	private transactionID;

	constructor(private serviceTransaction:BuyAssetTRService, fb: FormBuilder) {
		this.myForm = fb.group({
		  
			// printerID:this.printerID,
			// cashIncID:this.cashIncID,
  
			// cashDecID:this.cashDecID,
			blueprintCopyID:this.blueprintCopyID,
	  });
	}
	
	ngOnInit(): void {
		this.transactionFrom  = false;
		this.loadAllBlueprintCopies()
		.then(() => {                     
				this.transactionFrom  = true;
		});
		
	  }

	//get all blueprintCopies
	loadAllBlueprintCopies(): Promise<any> {
		let tempList = [];
		return this.serviceTransaction.getAllBlueprintCopies()
		.toPromise()
		.then((result) => {
				this.errorMessage = null;
		result.forEach(blueprintCopy => {
			//DISPLAY ONLY BLUEPRINT COPIES THAT HAVEN'T PRINTED YET
			if(blueprintCopy.printed == false)
				tempList.push(blueprintCopy);
		});
		this.allBlueprintCopies = tempList;
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

  	// execute(form: any): Promise<any> {
  	execute(form: any){
  		console.log(this.allBlueprintCopies);
		for (let blueprintCopy of this.allBlueprintCopies) {
			console.log(blueprintCopy); 
			if(blueprintCopy.blueprintCopyID == this.blueprintCopyID.value) {
				this.blueprintCopyCurrent = blueprintCopy;
			}
		}
		
		console.log("SELECTED BlueprintCopy:");
		console.log(this.blueprintCopyCurrent.blueprintCopyID);
		console.log(this.blueprintCopyCurrent.printed);
		console.log(this.blueprintCopyCurrent.otpEncryptedWithDesignerPubKey);
		console.log(this.blueprintCopyCurrent.otpEncryptedWithPrinterPubKey);
		console.log(this.blueprintCopyCurrent.printer);
		console.log(this.blueprintCopyCurrent.buyer);
		console.log(this.blueprintCopyCurrent.blueprintMaster);
		console.log(this.blueprintCopyCurrent.owner);

		//transaction object
    	this.confirmTransactionObj = {
	      "$class": "org.usecase.printer.ConfirmTransaction",
	      "blueprintCopy": "resource:org.usecase.printer.BlueprintCopy#"+this.blueprintCopyCurrent.blueprintCopyID
	    };
	    console.log(this.confirmTransactionObj);

	    //TODO check if buyer has enough money to buy the blueprint
	    return this.serviceTransaction.printBlueprint(this.confirmTransactionObj)
	    .toPromise()
	    .then((result) => {
	    	this.errorMessage = null;
              this.transactionID = result.transactionId;
              console.log(result)     
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
            }).then(() => {
              this.transactionFrom = false;
            });
  	}
}