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

	printerID = new FormControl("", Validators.required);
	cashIncID = new FormControl("", Validators.required); 
	
	cashDecID = new FormControl("", Validators.required);
	blueprintCopyID = new FormControl("", Validators.required);
	
	myForm: FormGroup;
	private transactionFrom;
	private errorMessage;
	private allBlueprintCopies;


	constructor(private serviceTransaction:BuyAssetTRService, fb: FormBuilder) {
		this.myForm = fb.group({
		  
			printerID:this.printerID,
			cashIncID:this.cashIncID,
  
			cashDecID:this.cashDecID,
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
		result.forEach(resident => {
			tempList.push(resident);
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

}