import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/shared/service/auth.service';
import { PaymentStatusComponent } from '../payment-status/payment-status.component';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {

  currentData:any;
  payments:any

  constructor(
    public auth:AuthService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PaymentHistoryComponent>,) {
      this.currentData = data;
    }

  ngOnInit(): void {
    this.auth.getPaymentHistory(this.currentData['party_id']).subscribe({
      next:(res:any)=>{
        console.log('paymnet history', res);
        this.payments = res.data;
      }
    })
    console.log(this.currentData)
  }

  receivePayment(){
    this.dialogRef.close({'action':'receivePayment'});
  }
}
