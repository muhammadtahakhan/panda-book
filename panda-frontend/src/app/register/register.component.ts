import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../shared/service/auth.service';
import { GlobalEventService } from '../shared/_helpers/global-event.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private _alive = true;
  returnUrl: string;
  rForm: FormGroup;
  auth: AuthService;
  rFormStatus = "registration";

  constructor(private spinner: NgxSpinnerService, private _snackBar: MatSnackBar, private route: ActivatedRoute,private router: Router, private globalEvents: GlobalEventService, auth:AuthService,  private formBuilder: FormBuilder) {
    this.auth = auth;
    this.rForm = this.createFormGroupWithBuilder(this.formBuilder);
  }

  ngOnInit(): void {

  }

  ngOnDestroy(){
    this._alive = false;
    }


  public form_error = (controlName: string, errorName: string) =>{
    return this.rForm.controls[controlName].hasError(errorName);
  }



  createFormGroupWithBuilder(formBuilder: FormBuilder) {
    return formBuilder.group({
      name: [null, Validators.compose([Validators.required])],
      mobile: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required, Validators.email])],
      password: [null, Validators.compose([Validators.required])],
      cpassword: [null, Validators.compose([Validators.required])],
      email_verification_code: [null, Validators.compose([])],
      // recaptchaReactive:[null, Validators.compose([Validators.required])],
    });
  }

  verifyEmail(){
    this.spinner.show();
    this.auth.verifyEmail(this.rForm.value)

    .subscribe({
      next:(res:any)=>{
        if(res.success){
          this.router.navigate(['login']);
          this.globalEvents.broadcast('serverMsg',"Please login");

        }
        this.spinner.hide();
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
              formControl.setErrors({ serverError: validationErrors[prop] });
            }
          });
        }
      },
    complete:()=>{
      this.spinner.hide();

    }
    });

  }

  onSubmit(){

    if(this.rFormStatus == 'registration'){
          this.spinner.show();
          this.auth.register(this.rForm.value)

          .subscribe({
            next:(res:any)=>{
              if(res.success){
                // this.router.navigate(['login']);
                this.globalEvents.broadcast('serverMsg',"Please verify your Email Address");
                this.rFormStatus = "verification";
                this.rForm.controls['email_verification_code'].setValidators([Validators.required]);
                this.rForm.controls['email_verification_code'].setValue("0000");
                this.rForm.updateValueAndValidity()
              }
              this.spinner.hide();
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
                      formControl.setErrors({ serverError: validationErrors[prop] });

                  }
                });
              }
            },
          complete:()=>{
            this.spinner.hide();

          }
          });

    }else{
      this.verifyEmail();
    }




  }

}


