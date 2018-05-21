import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Configuration } from '../configuration';
import { DataService } from '../data.service';
import { CancelRequestTRComponent } from './CancelRequestTR.component';
import {CancelRequestTRService} from './CancelRequestTR.service';
describe('TransactionComponent', () => {
  let component: CancelRequestTRComponent;
  let fixture: ComponentFixture<CancelRequestTRComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelRequestTRComponent ],
imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule
  ],
providers: [CancelRequestTRService,DataService,Configuration]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelRequestTRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
