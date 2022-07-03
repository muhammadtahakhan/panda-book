import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/shared/service/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor( private route: ActivatedRoute,private router: Router,private spinner: NgxSpinnerService,public dialog: MatDialog, public auth:AuthService) { }

  ngOnInit(): void {
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
