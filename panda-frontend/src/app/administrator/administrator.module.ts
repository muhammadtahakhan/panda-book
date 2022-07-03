import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministratorRoutingModule } from './administrator-routing.module';
import { MainComponent } from './main/main.component';
import { AngularMaterialModule } from '../material.module';
import { UserListComponent } from './user-list/user-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TagUserComponent } from './tag-user/tag-user.component';
import { UknListComponent } from './ukn-list/ukn-list.component';
import { KycFormComponent } from './kyc-form/kyc-form.component';


@NgModule({
  declarations: [
    MainComponent,
    UserListComponent,
    TagUserComponent,
    UknListComponent,
    KycFormComponent
  ],
  imports: [
    CommonModule,
    AdministratorRoutingModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,

    MatTableModule,
    MatSortModule

  ]
})
export class AdministratorModule { }
