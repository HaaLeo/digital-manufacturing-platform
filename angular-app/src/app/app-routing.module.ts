import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { TransactionComponent } from './Transaction/Transaction.component'
import { HomeComponent } from './home/home.component';

import { CashComponent } from './Cash/Cash.component';
import { QualityRequirementComponent } from './QualityRequirement/QualityRequirement.component';
import { BlueprintCopyComponent } from './BlueprintCopy/BlueprintCopy.component';

import { BuyAssetTRComponent } from './BuyAssetTR/BuyAssetTR.component';
import { CancelRequestTRComponent } from './CancelRequestTR/CancelRequestTR.component';
import { EnduserComponent } from 'app/Enduser/Enduser.component';
import { DesignerComponent } from 'app/Designer/Designer.component';
import { PrinterComponent } from 'app/Printer/Printer.component';

const routes: Routes = [
    // { path: 'transaction', component: TransactionComponent },
    {path: '', component: HomeComponent},
		{ path: 'Cash', component: CashComponent},
		{ path: 'QualityRequirement', component: QualityRequirementComponent},
		{ path: 'BlueprintCopy', component: BlueprintCopyComponent},
    { path: 'BuyAssetTR', component: BuyAssetTRComponent },
    { path: 'CancelRequestTR', component: CancelRequestTRComponent },
    { path: 'Enduser', component: EnduserComponent},
    { path: 'Designer', component: DesignerComponent},
    { path: 'Printer', component: PrinterComponent},
		{path: '**', redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
