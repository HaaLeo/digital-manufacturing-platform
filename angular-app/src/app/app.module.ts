import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { Configuration }     from './configuration';
import { DataService }     from './data.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CashComponent } from './Cash/Cash.component';
import { BlueprintMasterComponent } from './BlueprintMaster/BlueprintMaster.component';
import { BlueprintCopyComponent } from './BlueprintCopy/BlueprintCopy.component';
import { BuyAssetTRComponent } from 'app/BuyAssetTR/BuyAssetTR.component';
import { EnduserComponent } from 'app/Enduser/Enduser.component';
import { DesignerComponent } from 'app/Designer/Designer.component';

// import { TransactionComponent } from './Transaction/Transaction.component'

@NgModule({
  declarations: [
    AppComponent,
		HomeComponent,
    BuyAssetTRComponent,
    CashComponent,
		BlueprintMasterComponent,
    EnduserComponent,
    DesignerComponent,
    BlueprintCopyComponent
		
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    Configuration,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
