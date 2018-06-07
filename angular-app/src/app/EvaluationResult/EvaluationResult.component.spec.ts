import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationResultComponent } from './EvaluationResult.component';

describe('EvaluationResultComponent', () => {
  let component: EvaluationResultComponent;
  let fixture: ComponentFixture<EvaluationResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluationResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
