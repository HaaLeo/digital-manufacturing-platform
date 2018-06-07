import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintingJobComponent } from './PrintingJob.component';

describe('PrintingJobComponent', () => {
  let component: PrintingJobComponent;
  let fixture: ComponentFixture<PrintingJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintingJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintingJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
