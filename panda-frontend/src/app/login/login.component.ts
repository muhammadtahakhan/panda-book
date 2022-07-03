import { coerceStringArray } from '@angular/cdk/coercion';
import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../shared/service/auth.service';
import { GlobalEventService } from '../shared/_helpers/global-event.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private _alive = true;
  returnUrl: string;
  rForm: FormGroup;
  auth: any;

  constructor(private spinner: NgxSpinnerService, private _snackBar: MatSnackBar, private route: ActivatedRoute,private router: Router, private globalEvents: GlobalEventService, auth:AuthService,  private formBuilder: FormBuilder) {
    this.auth = auth;
    this.rForm = this.createFormGroupWithBuilder(this.formBuilder);
  }

  ngOnInit(): void {

  }

  ngOnDestroy(){
    this._alive = false;
    this.spinner.hide();
    }


  public myError = (controlName: string, errorName: string) =>{
    return this.rForm.controls[controlName].hasError(errorName);
  }

  createFormGroupWithBuilder(formBuilder: FormBuilder) {
    return formBuilder.group({
      email: [null, Validators.compose([Validators.required, Validators.email])],
      password: [null, Validators.compose([Validators.required])],
      // recaptchaReactive:[null, Validators.compose([Validators.required])],
    });
  }

  onSubmit(){
    this.spinner.show();
    this.auth.loginPost(this.rForm.value).subscribe(
      (res:any)=>{
              if(res.success){
                if(res.success.user.user_type == 'admin'){
                  this.router.navigate(['admin']);
                }else{
                  this.router.navigate(['dashboard']);
                }
                this.globalEvents.broadcast('serverMsg',"Login Successfully");

              }
              this.spinner.hide();
          },
      (error:any)=>{

        this.globalEvents.broadcast('serverMsg',error.error.error);
        this.spinner.hide();
      },
      ()=>{ this.spinner.hide(); }
    );
  }


}
