import { Component, Inject, OnInit } from '@angular/core';



import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalEventService } from 'src/app/shared/_helpers/global-event.service';
import { AuthService } from 'src/app/shared/service/auth.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TagUserComponent } from 'src/app/administrator/tag-user/tag-user.component';

export const APP_DATE_FORMATS = {
    parse: {
        dateInput: 'input',
    },
    display: {
        dateInput: 'DD-MMM-yyyy',
        monthYearLabel: 'MMMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY'
    },
};


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  currentData:any;

  private _alive = true;
  returnUrl: string;
  rForm: FormGroup;


  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TagUserComponent>,
    private spinner: NgxSpinnerService, private _snackBar: MatSnackBar, private route: ActivatedRoute,private router: Router, private globalEvents: GlobalEventService, private auth:AuthService,  private formBuilder: FormBuilder) {
    this.currentData = data;
    this.rForm = this.createFormGroupWithBuilder(this.formBuilder);


        }



  ngOnInit(): void {
    this.fetchUser();
  }

  ngOnDestroy(){
    this._alive = false;
  }

  fetchUser(userId = this.route.snapshot.params['userId']){
    if(userId){
      this.spinner.show();
      this.auth.getUserById(userId).subscribe({
        next:(res:any)=>{
          console.log("next", res)
          this.currentData = res?.data;
          // this.rForm.patchValue(this.currentData);
          this.rForm = this.createFormGroupWithBuilder(this.formBuilder);
          this.check();
        },
        error:(error:any)=>{  this.spinner.hide();},
        complete:()=>{ this.spinner.hide(); }
      });
    }

  }

  check(){
    console.log("this.rForm.value ", this.rForm.value);
  }





  public form_error = (controlName: string, errorName: string) =>{
    return this.rForm.controls[controlName].hasError(errorName);
  }




  createFormGroupWithBuilder(formBuilder: FormBuilder) {

    return formBuilder.group({

      id: [{value:this.currentData?.id, disabled:false}],
      name: [{value:this.currentData?.name, disabled:false}, Validators.compose([Validators.required])],
      mobile: [{value:this.currentData?.mobile, disabled:false}, Validators.compose([Validators.required])],
      email: [{value:this.currentData?.email, disabled:false}, Validators.compose([Validators.required])],
      address: [{value:this.currentData?.address, disabled:false}, Validators.compose([ ])]

    });
  }

  onSubmit(){
    let data = this.rForm.value;

    console.log(data);


    this.spinner.show();
    this.auth.createoOrUpdateAppartments(data)

    .subscribe({
      next:(res:any)=>{

       this.spinner.hide();
       this.dialogRef.close();

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
      complete:()=>{ this.spinner.hide(); }
    });


  }


  public findInvalidControls() {
    const invalid = [];
    const controls = this.rForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
}

}
