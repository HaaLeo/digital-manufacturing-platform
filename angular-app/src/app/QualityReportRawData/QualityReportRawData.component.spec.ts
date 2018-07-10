import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityReportRawComponent } from './QualityReportRawData.component';

describe('QualityReportRawComponent', () => {
  let component: QualityReportRawComponent;
  let fixture: ComponentFixture<QualityReportRawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualityReportRawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualityReportRawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
