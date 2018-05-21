import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Configuration } from '../configuration';
import { DataService } from '../data.service';
import { BlueprintCopyComponent } from './BlueprintCopy.component';
import {BlueprintCopyService} from './BlueprintCopy.service';
import { UsersPipe}    from './Pipe';
describe('BlueprintCopyComponent', () => {
  let component: BlueprintCopyComponent;
  let fixture: ComponentFixture<BlueprintCopyComponent>;
  let fixture2: ComponentFixture<UsersPipe>;
  let component2: UsersPipe;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlueprintCopyComponent, UsersPipe ],
imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule
  ],
  
providers: [BlueprintCopyService,DataService,Configuration, UsersPipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlueprintCopyComponent);
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
