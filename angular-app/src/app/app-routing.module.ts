import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { TransactionComponent } from './Transaction/Transaction.component'
import { HomeComponent } from './home/home.component';

import { QualityRequirementComponent } from './QualityRequirement/QualityRequirement.component';
import { BlueprintCopyComponent } from './BlueprintCopy/BlueprintCopy.component';

import { BuyAssetTRComponent } from './BuyAssetTR/BuyAssetTR.component';
import { CancelRequestTRComponent } from './CancelRequestTR/CancelRequestTR.component';
import { CustomerComponent } from 'app/Customer/Customer.component';
import { PrinterComponent } from 'app/Printer/Printer.component';

const routes: Routes = [
    // { path: 'transaction', component: TransactionComponent },
    {path: '', component: HomeComponent},
		{ path: 'QualityRequirement', component: QualityRequirementComponent},
		{ path: 'BlueprintCopy', component: BlueprintCopyComponent},
    { path: 'BuyAssetTR', component: BuyAssetTRComponent },
    { path: 'CancelRequestTR', component: CancelRequestTRComponent },
    { path: 'Customer', component: CustomerComponent},
    { path: 'Printer', component: PrinterComponent},
		{path: '**', redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
