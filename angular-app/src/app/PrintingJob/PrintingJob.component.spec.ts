import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Configuration } from '../configuration';
import { DataService } from '../data.service';
import { PrintingJobComponent } from './PrintingJob.component';
import {PrintingJobService} from './PrintingJob.service';
import { UsersPipe}    from './Pipe';
import {PrintingJob} from "../org.usecase.printer";
describe('PrintingJobComponent', () => {
  let component: PrintingJobComponent;
  let fixture: ComponentFixture<PrintingJobComponent>;
  let fixture2: ComponentFixture<UsersPipe>;
  let component2: UsersPipe;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintingJobComponent, UsersPipe ],
imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule
  ],
  
providers: [PrintingJobService,DataService,Configuration, UsersPipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintingJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fixture2 = TestBed.createComponent(UsersPipe);
    component2 = fixture2.componentInstance;
    fixture2.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
