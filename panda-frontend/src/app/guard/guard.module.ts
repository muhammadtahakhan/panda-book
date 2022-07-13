import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuardRoutingModule } from './guard-routing.module';
import { GuardComponent } from './main/guard.component';


@NgModule({
  declarations: [
    GuardComponent
  ],
  imports: [
    CommonModule,
    GuardRoutingModule
  ]
})
export class GuardModule { }
