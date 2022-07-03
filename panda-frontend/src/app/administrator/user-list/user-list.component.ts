import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/shared/service/auth.service';
import { DialogComponent } from 'src/app/shared/_components/dialog/dialog.component';
import { GlobalEventService } from 'src/app/shared/_helpers/global-event.service';
import * as moment from 'moment';
import { LovService } from 'src/app/shared/service/lov.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  cardsData :any;

  private _onDestroy = new Subject<void>();

  filter = "";

  privileges : any;
  listData: Array<any>;
  // -----------------------------------------------Pagination start
    total = 0;
    current_page = 0;
    pageSize = 5;
  // -----------------------------------------------Pagination end
    // ----------------------------------------------work for search start
    searchControl = new FormControl();

    private _search : string
    get search(): string { return this._search; }
    set search(value: string) { this._search = value; this.getList({pageIndex: 0, pageSize: this.pageSize});  }
    // ----------------------------------------------work for search end

  constructor(private lovService:LovService ,private globalEvents: GlobalEventService, private route: ActivatedRoute,private router: Router,private spinner: NgxSpinnerService,public dialog: MatDialog, public auth:AuthService) { }

  ngOnInit(): void {
    this.getList();
    this.auth.getstats().subscribe({
      next:(res:any)=>{ this.cardsData = <any> res.data },
      error:(error)=>{},
      complete:()=>{
        this.spinner.hide();
      },
    });
    // ----------------------------search field debounce start
    this.searchControl.valueChanges
    .pipe(debounceTime(500))
    .subscribe(newValue => this.search = newValue);
    // ---------------------------search field debounce end

  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }


  getList(event?:any){

    let eventData = event?event:{pageSize:this.pageSize,pageIndex: this.current_page};
    this.spinner.show();
    this.auth.getUserData(eventData, this.search, this.filter)
             .pipe(takeUntil(this._onDestroy))
             .subscribe({
               next:(res)=>{

                this.listData = res.data.data;
                this.total = res.data.total;
                this.current_page  = res.data.current_page-1;
                this.spinner.hide();
               },
               error:(error)=>{ console.log('error', error); this.spinner.hide(); },
               complete:()=>{ this.spinner.hide(); }
             })

  }

  loginThisUser(user:any){

    this.spinner.show();
      this.auth.loginNewUser(user).subscribe({
        next:(res)=>{ window.location.href="dashboard"  },
        error:(error)=>{},
        complete:()=>{ this.spinner.show();}
      });

  }

   // Dialog for delete Template
   openDialogRegenerate(item: any): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: {message: 'Are you sure, you want to Regenerate OTP', heading: 'Confirmation'}
    });

    dialogRef.afterClosed().pipe(takeUntil(this._onDestroy)).subscribe(result => {
     if(result) {this.regenerateOtp(item);}

    });
  }
   // Dialog for delete Template
   openDialogResendOtp(item: any): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: {message: 'Are you sure, you want to Resend OTP' , heading: 'Confirmation'}
    });

    dialogRef.afterClosed().pipe(takeUntil(this._onDestroy)).subscribe(result => {
     if(result) {this.resendOtp(item);}

    });
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

  // -----------------------------------------------Work for data sorting-------------------------

  sortData(sort: any ){
    console.log(sort);
    const data = this.listData.slice();
    if (!sort.active || sort.direction === '') {
      this.listData = data;
      return;
    }

    this.listData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a['id'], b['id'], isAsc);
        case 'email': return this.compare(a['id'], b['id'], isAsc);
        default: return 0;
      }
    });
  }

compare(a:number, b:number, isAsc:boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
// -----------------------------------------------Work for data sorting End-------------------------
  findAge(dob:any){

    let years = null;
    let a = moment();
    let now = moment();
    if(dob){
      var str = dob;
      var parts = str.slice(0, -1).split('T');
      a = moment(parts[0]);
      years = now.diff(a, 'years');
      years = years + " year";
    }
    return years;

  }

  findCountry(code:string){
   let country = this.lovService.country.filter(item=>item.value == code)[0];
   return country?.viewValue || "";

  }

  findCity(code:string){
    let country = this.lovService.city_town_village.filter(item=>item.value == code)[0];
    return country?.viewValue || "";

   }

}
