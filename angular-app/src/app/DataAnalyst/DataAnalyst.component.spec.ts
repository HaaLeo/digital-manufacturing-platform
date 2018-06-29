import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataAnalystComponent } from './DataAnalyst.component';

describe('DataAnalystComponent', () => {
  let component: DataAnalystComponent;
  let fixture: ComponentFixture<DataAnalystComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataAnalystComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataAnalystComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
