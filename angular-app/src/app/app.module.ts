import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { Configuration } from './configuration';
import { DataService } from './data.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CashComponent } from './Cash/Cash.component';
import { BlueprintMasterComponent } from './BlueprintMaster/BlueprintMaster.component';
import { PrintingJobComponent } from './PrintingJob/PrintingJob.component';
import { BuyAssetTRComponent } from 'app/BuyAssetTR/BuyAssetTR.component';
import { CancelRequestTRComponent } from 'app/CancelRequestTR/CancelRequestTR.component';
import { EnduserComponent } from 'app/Enduser/Enduser.component';
import { DesignerComponent } from 'app/Designer/Designer.component';
import { PrinterComponent } from 'app/Printer/Printer.component';
import { UsersPipe} from './PrintingJob/Pipe';
import { FileuploadComponent } from './fileupload/fileupload.component';
import { Ng2FileDropModule } from 'ng2-file-drop';
import { QualityRequirementComponent } from './QualityRequirement/QualityRequirement.component';
import { EvaluationResultComponent } from './EvaluationResult/EvaluationResult.component';
import {ManufacturerComponent} from "./Manufacturer/Manufacturer.component";
import { QualityReportComponent } from './QualityReport/QualityReport.component';
import { DataAnalystComponent } from './DataAnalyst/DataAnalyst.component';
import { QualityReportRawComponent } from './QualityReportRawData/QualityReportRawData.component';

// import { TransactionComponent } from './Transaction/Transaction.component'

@NgModule({
  declarations: [
    AppComponent,
		HomeComponent,
    BuyAssetTRComponent,
    CancelRequestTRComponent,
    CashComponent,
		BlueprintMasterComponent,
    EnduserComponent,
    DesignerComponent,
    PrinterComponent,
      PrintingJobComponent,
    UsersPipe,
    FileuploadComponent,
    QualityRequirementComponent,
    EvaluationResultComponent,
    ManufacturerComponent,
    QualityReportComponent,
    DataAnalystComponent,
    QualityReportRawComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    Ng2FileDropModule
  ],
  providers: [
    Configuration,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
