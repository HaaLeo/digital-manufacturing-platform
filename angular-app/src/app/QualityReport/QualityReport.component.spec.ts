import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityReportComponent } from './QualityReport.component';

describe('QualityReportComponent', () => {
  let component: QualityReportComponent;
  let fixture: ComponentFixture<QualityReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualityReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
