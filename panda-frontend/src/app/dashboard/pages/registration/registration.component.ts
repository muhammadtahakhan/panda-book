import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/shared/service/auth.service';
import { GlobalEventService } from 'src/app/shared/_helpers/global-event.service';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import * as moment from 'moment';

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
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]},
    // { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
]
})
export class RegistrationComponent implements OnInit {


  Identity = [
    {'value':"CNIC", 'viewValue':"CNIC"},
    {'value':"SNIC", 'viewValue':"SNIC"},
    {'value':"NICOP", 'viewValue':"NICOP"},
    {'value':"POC", 'viewValue':"POC"},
  ]

  residential_status = [
    {'value':"01" , 'viewValue':"Resident"},
    {'value':"02", 'viewValue':" Non-Resident"},
  ]

  relationship= [
    {'value':"01", 'viewValue':"Self"},
    {'value':"02", 'viewValue':"Father"},
    {'value':"03", 'viewValue':"Mother"},
    {'value':"04", 'viewValue':"Son"},
    {'value':"05", 'viewValue':"Daughter"},
    {'value':"06", 'viewValue':"Husband"},
    {'value':"07", 'viewValue':"Company"},
  ]

  private _alive = true;
  returnUrl: string;
  rForm: FormGroup;
  auth: AuthService;

  constructor(private spinner: NgxSpinnerService, private _snackBar: MatSnackBar, private route: ActivatedRoute,private router: Router, private globalEvents: GlobalEventService, auth:AuthService,  private formBuilder: FormBuilder) {
    this.auth = auth;
    this.rForm = this.createFormGroupWithBuilder(this.formBuilder);
  }

  ngOnInit(): void {

    this.rForm.get("RELATIONSHIP")?.valueChanges.subscribe({
      next:(res:any)=>{

        if(res=="01"){
          this.rForm.get('Relative_UIN')?.setValidators([Validators.required, Validators.pattern('^[^A-Za-z0-9]+$')]);
        }else{
          this.rForm.get('Relative_UIN')?.clearValidators();
        }
        this.rForm.controls['Relative_UIN'].updateValueAndValidity()

      }
    });

    this.rForm.get("IDENTIFICATION_TYPE")?.valueChanges.subscribe({
      next:(res:any)=>{
        console.log(res);
        if(res=="CNIC" || res=="SNIC"){
          this.rForm.get('MOBILE_NO')?.addValidators(Validators.required);
        }else{
          this.rForm.get('MOBILE_NO')?.clearValidators();
        }
        this.rForm.controls['MOBILE_NO'].updateValueAndValidity()

      }
    });
    this.rForm?.get('UIN')?.valueChanges.subscribe({
      next:(res:string)=>{ this.rForm.patchValue({'UIN': res.toUpperCase() }, {emitEvent: false}) }  });

    this.rForm?.get('NAME')?.valueChanges.subscribe({
      next:(res:string)=>{ this.rForm.patchValue({'NAME': res.toUpperCase() }, {emitEvent: false}) }  });

    this.rForm?.get('EMAIL')?.valueChanges.subscribe({
      next:(res:string)=>{ this.rForm.patchValue({'EMAIL': res.toUpperCase() }, {emitEvent: false}) }  });

    this.rForm?.get('IBAN_NO')?.valueChanges.subscribe({
      next:(res:string)=>{ this.rForm.patchValue({'IBAN_NO': res.toUpperCase() }, {emitEvent: false}) }  });

    this.rForm?.get('Relative_UIN')?.valueChanges.subscribe({
      next:(res:string)=>{ this.rForm.patchValue({'Relative_UIN': res.toUpperCase() }, {emitEvent: false}) }  });

    this.rForm?.get('bank_name')?.valueChanges.subscribe({
        next:(res:string)=>{ this.rForm.patchValue({'bank_name': res.toUpperCase() }, {emitEvent: false}) }  });

    this.rForm?.get('bank_name')?.valueChanges.subscribe({
        next:(res:string)=>{ this.rForm.patchValue({'bank_name': res.toUpperCase() }, {emitEvent: false}) }  });

    this.rForm?.get('ProofofIBAN')?.valueChanges.subscribe({
        next:(res:string)=>{ this.rForm.patchValue({'ProofofIBAN': res?.replace(/^data:image\/[a-z]+;base64,/, "") }, {emitEvent: false} ) }  });
    this.rForm?.get('proofofRelationship')?.valueChanges.subscribe({
        next:(res:string)=>{ this.rForm.patchValue({'proofofRelationship': res?.replace(/^data:image\/[a-z]+;base64,/, "") }, {emitEvent: false} ) }  });


  }

  ngOnDestroy(){
    this._alive = false;
    }


  public form_error = (controlName: string, errorName: string) =>{
    return this.rForm.controls[controlName].hasError(errorName);
  }



  createFormGroupWithBuilder(formBuilder: FormBuilder) {
    return formBuilder.group({
      userId: ["admin"],
      password: ["ccdkasbAccount"],
      IDENTIFICATION_TYPE: [this.auth.currentUser?.identification_type, Validators.compose([Validators.required])],
      RESIDENTIAL_STATUS: [this.auth.currentUser?.residential_status, Validators.compose([Validators.required])],
      UIN: [this.auth.currentUser?.uin, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')])],
      NAME: [this.auth.currentUser?.name, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')])],
      MOBILE_NO: [this.auth.currentUser?.mobile],
      ISSUE_DATE: [this.auth.currentUser?.issue_date, Validators.compose([Validators.required])],
      EMAIL: [this.auth.currentUser?.email, Validators.compose([Validators.required])],
      RELATIONSHIP: [this.auth.currentUser?.relationship, Validators.compose([Validators.required])],
      IBAN_NO: [this.auth.currentUser?.iban, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$') ])],
      Relative_UIN: [this.auth.currentUser?.relative_uin,  Validators.compose([ Validators.pattern('^[a-zA-Z0-9 ]+$') ]) ],
      ProofofIBAN: [this.auth.currentUser?.ProofofIBAN],
      proofofRelationship: [this.auth.currentUser?.proofofRelationship]

    });
  }

  onSubmit(){
    let data = this.rForm.value;


    try {
      // data.ISSUE_DATE = this.rForm.value.ISSUE_DATE.format('DD-MMM-yyyy');
      data.ISSUE_DATE = moment(data.ISSUE_DATE).format('DD-MMM-yyyy');
    } catch (error) {
      data.ISSUE_DATE = moment(data.ISSUE_DATE).format('DD-MMM-yyyy');
    }

    this.spinner.show();
    this.auth.GenerateOtp(data)

    .subscribe({
      next:(res:any)=>{
       let success = ['200 = Record Posted Sucsessfully'];
       let already = ['227 = Record already exists for provided UIN.'];
       this.globalEvents.broadcast('serverMsg',res.errorDescription);
       if(success.includes(res.errorDescription)){
              this.updateUserData(1);
        }else if(already.includes(res.errorDescription)){
          this.globalEvents.broadcast('serverMsg',"As Record already please fill this form");
          this.updateUserData(1);
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

  updateUserData(opt_generated:any=null){
    this.spinner.show();
    let userData = {
      'identification_type' : this.rForm.value.IDENTIFICATION_TYPE,
      'residential_status' : this.rForm.value.RESIDENTIAL_STATUS,
      'uin' : this.rForm.value.UIN,
      'name' : this.rForm.value.NAME,
      'mobile' : this.rForm.value.MOBILE_NO,
      'issue_date' : this.rForm.value.ISSUE_DATE,
      'email' : this.rForm.value.EMAIL,
      'relationship' : this.rForm.value.RELATIONSHIP,
      'iban' : this.rForm.value.IBAN_NO,
      'relative_uin' : this.rForm.value.Relative_UIN,
      'ProofofIBAN' : this.rForm.value.ProofofIBAN,
      'proofofRelationship' : this.rForm.value.proofofRelationship,
      'opt_generated' : opt_generated,
      // 'opt_verified' : ,
      // 'opt_code' : ,
    }
    // console.log("====>", userData);
    // return false;
    this.auth.updateUserData(userData)

    .subscribe({
      next:(res:any)=>{

        this.spinner.hide();
        this.router.navigate(['dashboard']);
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



  handleImageUpload(fileToUpload:any,name:string) {
    // check for image to upload
    // this checks if the user has uploaded any file
    if (fileToUpload.target.files && fileToUpload.target.files[0]) {
      // calculate your image sizes allowed for upload
      const max_size = 600000;
      // the only MIME types allowed
      const allowed_types = ['image/png', 'image/jpeg','image/jpg'];
      // max image height allowed
      const max_height = 14200;
      //max image width allowed
      const max_width = 15600;

      // check the file uploaded by the user
      if (fileToUpload.target.files[0].size > max_size) {
        //show error
        let error = 'max image size allowed is ' + max_size / 1000 + 'kb';
        //show an error alert using the Toastr service.

        this.globalEvents.broadcast('serverMsg',error);
        return false;
      }
      // check for allowable types
      if (!allowed_types.includes(fileToUpload.target.files[0].type)) {
        // define the error message due to wrong MIME type
        let error = 'The allowed images are: ( JPEG | JPG | PNG )';
        // show an error alert for MIME
        this.globalEvents.broadcast('serverMsg',error);
        //return false since the MIME type is wrong
        return false;
      }
      // define a file reader constant
      const reader = new FileReader();
      // read the file on load
      reader.onload = (e: any) => {
        // create an instance of the Image()
        const image = new Image();
        // get the image source
        image.src = e.target.result;
        // @ts-ignore
        image.onload = (rs:any) => {
          // get the image height read
          const img_height = rs.currentTarget['height'];
          // get the image width read
          const img_width = rs.currentTarget['width'];
          // check if the dimensions meet the required height and width
          if (img_height > max_height && img_width > max_width) {
            // throw error due to unmatched dimensions
           let error =
              'Maximum dimensions allowed: ' +
              max_height +
              '*' +
              max_width +
              'px';
            return false;
          } else {
            // otherise get the base64 image
            this.rForm.get(name)?.setValue(e.target.result);
           console.log(this.rForm.value);
          }
        };
      };
      // reader as data url
      reader.readAsDataURL(fileToUpload.target.files[0]);

    }
    return true;
  }


}
