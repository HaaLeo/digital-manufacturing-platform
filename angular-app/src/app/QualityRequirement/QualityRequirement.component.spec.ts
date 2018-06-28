import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityRequirementComponent } from './QualityRequirement.component';
import {QualityRequirementService} from "./QualityRequirement.service";
import {DataService} from "../data.service";
import {Configuration} from "../configuration";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {UsersPipe} from "../PrintingJob/Pipe";

describe('QualityRequirementComponent', () => {
  let component: QualityRequirementComponent;
  let fixture: ComponentFixture<QualityRequirementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualityRequirementComponent ],
        imports: [
            BrowserModule,
            FormsModule,
            ReactiveFormsModule,
            HttpModule
        ],
        providers: [QualityRequirementService, DataService, Configuration, UsersPipe]
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
