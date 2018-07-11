import { Component, OnInit } from '@angular/core';
import { QualityReport, QualityReportRaw } from '../org.usecase.printer';
import { QualityReportRawService } from './QualityReportRaw.service';
import {DataAnalystService} from "../DataAnalyst/DataAnalyst.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-quality-report-raw',
  templateUrl: './QualityReportRaw.component.html',
  styleUrls: ['./QualityReportRaw.component.css'],
  providers: [QualityReportRawService, DataAnalystService]
})
export class QualityReportRawComponent implements OnInit {
    myForm: FormGroup;

    dataAnalystID = new FormControl("");

  private errorMessage;
  private progressMessage;
  private successMessage;
  private currentId;

  private allQualityReportsRaw: QualityReportRaw [];
  private allAnalysts;

  private current_db_id;

  constructor(private serviceQualityReportRaw: QualityReportRawService, private serviceDataAnalyst: DataAnalystService) {
  // TODO add myForm.
  };

  ngOnInit(): void {
    this.loadAllQualityReportsRaw();
    this.loadAllDataAnalysts();
  }

  //Get all quality reports raw and their
  loadAllQualityReportsRaw(): Promise<any> {
    //retrieve all BlueprintMaster
    let tempList = [];
    return this.serviceQualityReportRaw.getAll()
      .toPromise()
      .then((result) => {
        this.errorMessage = null;
        result.forEach(rawReport => {
          tempList.push(rawReport);
        });
      })
      .then(() => {
        for (let rawReport of tempList) {
          const stakeholders = [];
          for(const stakeholder of rawReport.stakeholder) {
            var splitted_ownerID = stakeholder.split("#", 2);
             stakeholders.push(String(splitted_ownerID[1]));
          }

          rawReport.formattedStakeholders = stakeholders;
          rawReport.formattedPrintingJob = rawReport.printingJob.split("#", 2)[1];
        }
        this.allQualityReportsRaw = tempList;
        if (0 < tempList.length) {
          this.current_db_id = tempList[tempList.length - 1].qualityReportRawID.substr(2);
        } else {
          this.current_db_id = 0;
        }
      });
  }

    //Get all data analysts
    loadAllDataAnalysts(): Promise<any> {
        let tempList = [];
        return this.serviceDataAnalyst.getAllDataAnalysts()
            .toPromise()
            .then((result) => {
                this.errorMessage = null;
                result.forEach(analyst => {
                    tempList.push(analyst);
                });
                this.allAnalysts = tempList;
            })
            .catch((error) => {
                if(error == 'Server error'){
                    this.progressMessage = null;
                    this.errorMessage = "Could not connect to REST server. Please check your configuration details";
                }
                else if(error == '404 - Not Found'){
                    this.progressMessage = null;
                    this.errorMessage = "404 - Could not find API route. Please check your available APIs.";
                }
                else{
                    this.progressMessage = null;
                    this.errorMessage = error;
                }
            });
    }

    setId(id: any): void {
        this.currentId = id;
    }

    shareDataWithAnalyst(form: any): void {
      debugger;
      //TODO Update RawReport by adding dataanalyst to stakeholders array
    }

}
