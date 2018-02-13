import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CancelRequestTRService } from './CancelRequestTR.service';

@Component({
	selector: 'app-CancelRequestTR',
	templateUrl: './CancelRequestTR.component.html',
	styleUrls: ['./CancelRequestTR.component.css'],
  	providers: [CancelRequestTRService]
})

export class CancelRequestTRComponent {
	myForm: FormGroup;
	blueprintCopyID = new FormControl("", Validators.required);

	private transactionFrom;
	private errorMessage;
	private allBlueprintCopies;
	
	private blueprintCopyCurrent;
	private cancelRequestObj;
	private transactionID;

	constructor(private serviceTransaction:CancelRequestTRService, fb: FormBuilder) {
		this.myForm = fb.group({
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

	//Get all BlueprintCopies
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

  	execute(form: any){
  		console.log(this.allBlueprintCopies);
		for (let blueprintCopy of this.allBlueprintCopies) {
			if(blueprintCopy.blueprintCopyID == this.blueprintCopyID.value) {
				this.blueprintCopyCurrent = blueprintCopy;
			}
		}
    	this.cancelRequestObj = {
	      "$class": "org.usecase.printer.CancelRequest",
	      "blueprintCopy": "resource:org.usecase.printer.BlueprintCopy#"+this.blueprintCopyCurrent.blueprintCopyID
	    };
	    return this.serviceTransaction.cancelRequest(this.cancelRequestObj)
	    .toPromise()
	    .then((result) => {
	    	this.errorMessage = null;
              this.transactionID = result.transactionId;
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
            	if(this.errorMessage == 'Cannot buy asset. Not enough funds.') {
            		this.transactionFrom = true;		
            	} else 
 		             this.transactionFrom = false;
            });
  	}
}