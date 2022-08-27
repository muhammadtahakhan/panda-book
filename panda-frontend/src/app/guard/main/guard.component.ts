import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/shared/service/auth.service';

@Component({
  selector: 'app-guard',
  templateUrl: './guard.component.html',
  styleUrls: ['./guard.component.css']
})
export class GuardComponent implements OnInit {
  showFiller = false;
  cardsData :any;

  constructor( private route: ActivatedRoute,private router: Router,private spinner: NgxSpinnerService,public dialog: MatDialog, public auth:AuthService) { }
  ngOnInit(): void {

    this.isAdmin();

  }

  isAdmin(){

    this.auth.getCurrrentUserData().subscribe({
      next:(res)=>{

        if(res.user_type != 'guard' && res.user_type != 'admin') {
            this.logout();
        }

      },
      error:(error)=>{ },
      complete:()=>{ }
    });

  }

  logout(){
    this.spinner.show();
    this.auth.logout().subscribe({
      next:(res)=>{
        this.router.navigate(['login']);
        this.spinner.hide();
      },
      error:(error)=>{
        this.spinner.hide();
      }
    });
  }

}
