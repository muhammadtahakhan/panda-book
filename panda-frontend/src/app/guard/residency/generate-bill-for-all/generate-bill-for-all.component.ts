import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/shared/service/auth.service';
import { GlobalEventService } from 'src/app/shared/_helpers/global-event.service';

@Component({
  selector: 'app-generate-bill-for-all',
  templateUrl: './generate-bill-for-all.component.html',
  styleUrls: ['./generate-bill-for-all.component.css']
})
export class GenerateBillForAllComponent implements OnInit {

  private _onDestroy = new Subject<void>();
  returnUrl: string;
  rForm: FormGroup;

  currentData:any;

  constructor( public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<GenerateBillForAllComponent>,
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

      amount:[null, Validators.compose([Validators.required])],
      description:[null, Validators.compose([Validators.required])],


    });
  }

  onSubmit(){
    let data = this.rForm.value;

      if(this.rForm.valid){
        this.spinner.show();
        this.auth.generateBillForAll(data).subscribe({
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
