import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../shared/service/auth.service';
import { GlobalEventService } from '../shared/_helpers/global-event.service';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgetpasswordComponent implements OnInit {

  private _alive = true;
  returnUrl: string;
  rForm: FormGroup;
  isCodeGenerated = false;
 
  
  constructor(private spinner: NgxSpinnerService, private _snackBar: MatSnackBar, private route: ActivatedRoute,private router: Router, private globalEvents: GlobalEventService,public auth:AuthService,  private formBuilder: FormBuilder) { 
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
      email: [null, Validators.compose([ Validators.required, Validators.email ])],
      mobile: [null, Validators.compose([Validators.required])],
      token: [null],
      password: [null],
      password_confirmation: [null]
    });
  }

  
  sendCode(){
    this.spinner.show();
    this.auth.sendPassCode(this.rForm.value).subscribe({
     next: (res:any)=>{ 
             
                this.globalEvents.broadcast('serverMsg',res?.message );  
               
                this.isCodeGenerated = true;
                // this.rForm.get('token')?.addValidators(Validators.required);    
                // this.rForm.get('password')?.addValidators(Validators.required);    
                // this.rForm.get('password_confirmation')?.addValidators(Validators.required);   
                
                // this.rForm.controls['token'].updateValueAndValidity();
                // this.rForm.controls['password'].updateValueAndValidity();
                // this.rForm.controls['password_confirmation'].updateValueAndValidity();

                // this.rForm.controls['token'].reset();
                // this.rForm.controls['password'].reset();
                // this.rForm.controls['password_confirmation'].reset();


               
              this.spinner.hide();
          },
     error: (error:any)=>{
     
        this.globalEvents.broadcast('serverMsg', error.error.message); 
        this.spinner.hide();
      },
     complete: ()=>{ this.spinner.hide(); }
    });
  }


  onSubmit(){
    this.spinner.show();
    this.auth.resetPass(this.rForm.value).subscribe({
      next:(res:any)=>{ 
             
              this.router.navigate(['login']);                             
             
              this.globalEvents.broadcast('serverMsg', res?.message);
              this.spinner.hide();
          },
      error:(error:any)=>{
        const validationErrors = error.error.error;
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
        else{
          this.globalEvents.broadcast('serverMsg', error.error?.message);
        }
       
        this.spinner.hide();
      },
      complete:()=>{ this.spinner.hide(); }
    });
  }


}
