import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { TransactionComponent } from './Transaction/Transaction.component'
import { HomeComponent } from './home/home.component';

import { CashComponent } from './Cash/Cash.component';
import { BlueprintMasterComponent } from './BlueprintMaster/BlueprintMaster.component';
import { BlueprintCopyComponent } from './BlueprintCopy/BlueprintCopy.component';

import { BuyAssetTRComponent } from './BuyAssetTR/BuyAssetTR.component';

const routes: Routes = [
    // { path: 'transaction', component: TransactionComponent },
    {path: '', component: HomeComponent},
		
		{ path: 'Cash', component: CashComponent},
		
		{ path: 'BlueprintMaster', component: BlueprintMasterComponent},
		
		{ path: 'BlueprintCopy', component: BlueprintCopyComponent},
    
    { path: 'BuyAssetTR', component: BuyAssetTRComponent },
		{path: '**', redirectTo:''}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
