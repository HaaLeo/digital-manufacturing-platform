import { Component, OnInit } from '@angular/core';
import { QualityReport, QualityReportRaw } from '../org.usecase.printer';
import { QualityReportRawService } from './QualityReportRaw.service';

@Component({
  selector: 'app-quality-report-raw',
  templateUrl: './QualityReportRaw.component.html',
  styleUrls: ['./QualityReportRaw.component.css'],
  providers: [QualityReportRawService]
})
export class QualityReportRawComponent implements OnInit {

  private errorMessage;
  private progressMessage;
  private successMessage;

  private allQualityReportsRaw: QualityReportRaw [];

  private current_db_id;

  constructor(private serviceQualityReportRaw: QualityReportRawService) {
  };

  ngOnInit(): void {
    this.loadAllQualityReportsRaw();
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

}
