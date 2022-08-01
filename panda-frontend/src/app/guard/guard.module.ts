import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuardRoutingModule } from './guard-routing.module';
import { GuardComponent } from './main/guard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AngularMaterialModule } from '../material.module';
import { ListComponent } from './residency/list/list.component';
import { CreateComponent } from './residency/create/create.component';
import { PaymentStatusComponent } from './residency/payment-status/payment-status.component';
import { ReceivePaymentComponent } from './residency/receive-payment/receive-payment.component';


@NgModule({
  declarations: [
    GuardComponent,
    ListComponent,
    CreateComponent,
    PaymentStatusComponent,
    ReceivePaymentComponent
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
