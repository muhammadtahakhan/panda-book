import { Component, Inject, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/shared/service/auth.service';
import { DialogComponent } from 'src/app/shared/_components/dialog/dialog.component';
import { GlobalEventService } from 'src/app/shared/_helpers/global-event.service';
@Component({
  selector: 'app-tag-user',
  templateUrl: './tag-user.component.html',
  styleUrls: ['./tag-user.component.css']
})
export class TagUserComponent implements OnInit {

  private _onDestroy = new Subject<void>();
  returnUrl: string;
  rForm: FormGroup;

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TagUserComponent>,

              private spinner: NgxSpinnerService,
              private _snackBar: MatSnackBar,
              private route: ActivatedRoute,private router: Router,
              private globalEvents: GlobalEventService, private auth:AuthService,  private formBuilder: FormBuilder) {

                this.rForm = this.createFormGroupWithBuilder(this.formBuilder);
              }

  ngOnInit(): void {
    // console.log("Dialog => ",this.data);
    this.rForm?.get('tag_document')?.valueChanges.subscribe({
      next:(res:string)=>{ this.rForm.patchValue({'tag_document': res?.replace(/^data:image\/[a-z]+;base64,/, "") }, {emitEvent: false} ) }  });
      this.rForm.patchValue(this.data);
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
      userId: ["admin"],
      password: ["ccdkasbAccount"],
      id: [this.data?.id?this.data?.id:null],
      uin: [{value:this.data?.uin?this.data?.uin:null, disabled: false}, Validators.compose([Validators.required])],
      ukn: [this.data?.ukn?this.data?.ukn:null, Validators.compose([Validators.required])],
      otp: [this.data?.otp?this.data?.otp:null, Validators.compose([Validators.required])],
      tag_document: [this.data?.tag_document?this.data?.tag_document:null]

    });
  }



  onSubmit(){
    // console.log("onSubmit", this.rForm.value);
      if(this.rForm.valid){
        this.spinner.show();
        this.auth.createUkn(this.rForm.value).subscribe({
          next:(res)=>{},
          error:(error)=>{},
          complete:()=>{this.spinner.hide(); this.dialogRef.close();}
        });

      }

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
          //  console.log(this.rForm.value);
          }
        };
      };
      // reader as data url
      reader.readAsDataURL(fileToUpload.target.files[0]);

    }
    return true;
  }

    // Dialog for delete Template
    openDialogTag(item = this.rForm.value): void {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '250px',
        data: {message: 'Are you sure, you want to tag this UKN', heading: 'Confirmation'}
      });

      dialogRef.afterClosed().pipe(takeUntil(this._onDestroy)).subscribe(result => {
       if(result) {this.tag(item);}

      });
    }

    // Dialog for delete Template
    openDialogResendOtp(item = this.rForm.value): void {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '250px',
        data: {message: 'Are you sure, you want to Resend OTP' , heading: 'Confirmation'}
      });

      dialogRef.afterClosed().pipe(takeUntil(this._onDestroy)).subscribe(result => {
       if(result) {this.resendOtp(item);}

      });
    }

     // Dialog for delete Template
     openDialogRegenerate(item = this.rForm.value): void {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '250px',
        data: {message: 'Are you sure, you want to Regenerate OTP', heading: 'Confirmation'}
      });

      dialogRef.afterClosed().pipe(takeUntil(this._onDestroy)).subscribe(result => {
       if(result) {this.regenerateOtp(item);}

      });
    }

    tag(item:any){
      this.spinner.show();
      this.auth.tagUkn(item).pipe(takeUntil(this._onDestroy)).subscribe(
        (res:any)=>{
          this.globalEvents.broadcast('serverMsg',res.errorDescription);

        },
        (error)=>{},
        ()=>{this.spinner.hide();}
      );
    }

    resendOtp(item:any){
      this.spinner.show();
      this.auth.resendOtp(item).pipe(takeUntil(this._onDestroy)).subscribe(
        (res:any)=>{
          this.globalEvents.broadcast('serverMsg',res.errorDescription);


        },
        (error)=>{},
        ()=>{this.spinner.hide();}
      );
    }

    regenerateOtp(item:any){
      this.spinner.show();
      this.auth.regenerateOtp(item).pipe(takeUntil(this._onDestroy)).subscribe(
        (res:any)=>{
          this.globalEvents.broadcast('serverMsg',res.errorDescription);


        },
        (error)=>{},
        ()=>{this.spinner.hide();}
      );
    }

}

