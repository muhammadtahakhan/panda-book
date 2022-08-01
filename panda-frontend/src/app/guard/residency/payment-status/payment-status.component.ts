import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TagUserComponent } from 'src/app/administrator/tag-user/tag-user.component';

@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.css']
})
export class PaymentStatusComponent implements OnInit {
  currentData:any;

  constructor( public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PaymentStatusComponent>,) {
      this.currentData = data;
    }

  ngOnInit(): void {
  }

  receivePayment(){
    this.dialogRef.close({'action':'receivePayment'});
  }

}
