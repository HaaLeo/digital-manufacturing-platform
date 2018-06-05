import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { Configuration } from './configuration';
import { DataService } from './data.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { QualityRequirementComponent } from './QualityRequirement/QualityRequirement.component';
import { CustomerComponent } from 'app/Customer/Customer.component';
import { PrinterComponent } from 'app/Printer/Printer.component';
import { Ng2FileDropModule } from 'ng2-file-drop';
import { PrintingJobComponent } from './PrintingJob/PrintingJob.component';
import { EvaluationResultComponent } from './EvaluationResult/EvaluationResult.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QualityRequirementComponent,
    CustomerComponent,
    PrinterComponent,
    PrintingJobComponent,
    EvaluationResultComponent,
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
