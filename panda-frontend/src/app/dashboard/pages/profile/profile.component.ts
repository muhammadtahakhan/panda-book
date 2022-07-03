import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/shared/service/auth.service';
import { GlobalEventService } from 'src/app/shared/_helpers/global-event.service';
import { VerificationComponent } from '../../components/verification/verification.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user:any;
  constructor(private _snackBar: MatSnackBar, private route: ActivatedRoute,private router: Router, private globalEvents: GlobalEventService,private spinner: NgxSpinnerService,public dialog: MatDialog, public auth:AuthService) {}

  ngOnInit(): void {
    this.start();
  }

  start(){
    this.spinner.show();
    this.auth.getCurrrentUserData().subscribe({
      next:(res:any)=>{
        if(res){
          console.log("res.user_type", res.user_type);
          if(res.user_type == "admin"){
            this.router.navigate(['admin']);
          }
         this.user = res;

        }
        this.spinner.hide();
    },
      error:(error:any)=>{
        const validationErrors = error.error.error;

        this.spinner.hide();}
    });
  }

  ngAfterViewInit(){
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);

  }

  openDialog() {
    const dialogRef = this.dialog.open(VerificationComponent, {

      panelClass: 'fullscreen-dialog',


    });

    dialogRef.afterClosed().subscribe(result => {

      this.start();
    });
  }

}
