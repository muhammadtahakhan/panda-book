import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/shared/service/auth.service';
import { GlobalEventService } from 'src/app/shared/_helpers/global-event.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {
  private _onDestroy = new Subject<void>();
  returnUrl: string;
  rForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<VerificationComponent>,private globalEvents: GlobalEventService, public auth:AuthService, private spinner: NgxSpinnerService,private formBuilder: FormBuilder) {
    this.rForm = this.createFormGroupWithBuilder(this.formBuilder);
  }

  ngOnInit(): void {

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
      UIN: [  this.auth.currentUser.uin, Validators.compose([Validators.required])],
      OTP: [null, Validators.compose([Validators.required])],

    });
  }

  onSubmit(){

    this.spinner.show();
    this.auth.verifyOtp(this.rForm.value)

    .subscribe({
      next:(res:any)=>{
        if(res.success){

        }
       let error = ['312 =OTP is not verified.'];

        this.globalEvents.broadcast('serverMsg',res.errorDescription);
        this.spinner.hide();
        // debugger;
        if(!error.includes(res.errorDescription)){
          this.updateUserData();
        }
      },
      error:(error:any)=>{
        const validationErrors = error.error.error;

        this.spinner.hide();
        if(error.status === 422) {

        }
      },
      complete:()=>{ this.spinner.hide(); }
    });
  }

    regenerateOtp(item:any){
      console.log("===>", item);
      this.spinner.show();
      this.auth.regenerateOtp(item).pipe(takeUntil(this._onDestroy)).subscribe(
        (res:any)=>{
          this.globalEvents.broadcast('serverMsg',res.errorDescription);
        },
        (error)=>{this.spinner.hide();},
        ()=>{this.spinner.hide();}
      );
    }



  updateUserData(opt_generated:any=null){
    this.spinner.show();
    let userData = {

      'opt_verified' : 1,
      'opt_code' : this.rForm.value.OTP ,
    }
    console.log("====>", userData);
    // return false;
    this.auth.updateUserData(userData)

    .subscribe({
      next:(res:any)=>{
        this.spinner.hide();
    },
      error:(error:any)=>{
        const validationErrors = error.error.error;
        this.spinner.hide();

      },
      complete:()=>{ this.spinner.hide();  this.dialogRef.close();}
    });


  }
}

