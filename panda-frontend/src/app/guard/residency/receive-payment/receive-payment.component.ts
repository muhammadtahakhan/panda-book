import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/shared/service/auth.service';
import { GlobalEventService } from 'src/app/shared/_helpers/global-event.service';
import { PaymentStatusComponent } from '../payment-status/payment-status.component';

@Component({
  selector: 'app-receive-payment',
  templateUrl: './receive-payment.component.html',
  styleUrls: ['./receive-payment.component.css']
})
export class ReceivePaymentComponent implements OnInit {
  descriptionList: string[] = ['Jan-22', 'Feb-22', 'March-22', 'April-22', 'May-22', 'Jun-22', 'July-22', 'August-22', 'Sep-22', 'Oct-22', 'Nov-22', 'Dec-22'];
  paymentCategory: string[] = ['Maintenance', 'Color', 'Parking', 'Other']
  paymentType: string[] = ['Cash', 'Cheque', 'Online']
  private _onDestroy = new Subject<void>();
  returnUrl: string;
  rForm: FormGroup;

  currentData:any;

  constructor( public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ReceivePaymentComponent>,
    public auth:AuthService,
    private spinner: NgxSpinnerService,
    private globalEvents: GlobalEventService,
    private formBuilder: FormBuilder
    ) {
      this.currentData = data;
      this.rForm = this.createFormGroupWithBuilder(this.formBuilder);
    }

  ngOnInit(): void {
    console.log( this.currentData);
    this.rForm.get('payment_type')?.valueChanges.subscribe({
      next:(item)=>{
          // console.log("payment_type",item, this.rForm.get('payment_type')?.value);
          if(item == 'Cash' ){   this.rForm.get('cheque_number')?.setValue('');   }
      }
    });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  public form_error = (controlName: string, errorName: string) =>{
    return this.rForm.controls[controlName].hasError(errorName);
  }

  createFormGroupWithBuilder(formBuilder: FormBuilder) {
    return formBuilder.group({

      paid_amount: [this.data['payment']['remaining_amount'] || null],
      description: [null],
      payment_category: [null],
      payment_type: [null],
      cheque_number: [null],


    });
  }

  onSubmit(){
    let data = {
      "paid_amount": this.rForm.value['paid_amount'],
      "description": this.rForm.value['description'].toString(),
      "party_id": this.data['payment']['party_id'],
      "payment_category": this.rForm.value['payment_category'].toString(),
      "payment_type": this.rForm.value['payment_type'].toString(),
      "cheque_number":this.rForm.value['cheque_number'].toString()
    }

      if(this.rForm.valid){
        this.spinner.show();
        this.auth.receivePayment(data).subscribe({
          next:(res:any)=>{
            if(res.success){
              this.globalEvents.broadcast('serverMsg',res['message']);
            }
          },
          error:(error:any)=>{
            const validationErrors = error.error.error;

            this.spinner.hide();
            if(error.status === 422) {
              Object.keys(validationErrors).forEach(prop => {

                this.globalEvents.broadcast('serverMsg',validationErrors[prop]);
                const formControl = this.rForm.get(prop);
                if (formControl) {
                  // activate the error message
                  formControl.setErrors({
                    serverError: validationErrors[prop]
                  });
                }
              });
            }
          },
          complete:()=>{this.spinner.hide(); this.dialogRef.close();}
        });

      }
    }


}
