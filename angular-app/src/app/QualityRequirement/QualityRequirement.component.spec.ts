import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityRequirementComponent } from './QualityRequirement.component';

describe('QualityRequirementComponent', () => {
  let component: QualityRequirementComponent;
  let fixture: ComponentFixture<QualityRequirementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualityRequirementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualityRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
