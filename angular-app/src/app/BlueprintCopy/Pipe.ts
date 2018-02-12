import { Pipe, PipeTransform, Component, OnInit } from '@angular/core';
import { BlueprintCopy, Designer, Printer, Enduser } from '../org.usecase.printer';
import { NgModule }      from '@angular/core';


@Component({
	selector: 'pipe'
})

@NgModule({
    imports:[]
})

@Pipe({
  name: 'usersPipe',
  pure: false
})
export class UsersPipe implements PipeTransform {
  transform(bpcs: any [], searchTerm: string) {
      if (searchTerm === undefined || searchTerm === "all" || bpcs === undefined || bpcs.length == 0) {
        return bpcs;
      } else {
            if (searchTerm.charAt(0) === "D"){
                return bpcs.filter(bpc => bpc.designer === searchTerm);
            } else if (searchTerm.charAt(0) === "P"){
                return bpcs.filter(bpc => bpc.printer === searchTerm);
            } else if (searchTerm.charAt(0) === "E"){
                return bpcs.filter(bpc => bpc.buyer === searchTerm);
            } else {
                return [];
            }
      }
  }

  static forRoot() {
    return {
        ngModule: UsersPipe,
        providers: [],
    };
    }
}