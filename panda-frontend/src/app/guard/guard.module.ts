import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuardRoutingModule } from './guard-routing.module';
import { GuardComponent } from './main/guard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AngularMaterialModule } from '../material.module';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';


@NgModule({
  declarations: [
    GuardComponent,
    ListComponent,
    CreateComponent
  ],
  imports: [
    CommonModule,
    GuardRoutingModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    MatTableModule,
    MatSortModule
  ]
})
export class GuardModule { }
