import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/shared/service/auth.service';
import { DialogComponent } from 'src/app/shared/_components/dialog/dialog.component';
import { GlobalEventService } from 'src/app/shared/_helpers/global-event.service';
import { CreateComponent } from '../create/create.component';
import { PaymentStatusComponent } from '../payment-status/payment-status.component';
import { ReceivePaymentComponent } from '../receive-payment/receive-payment.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {


  private _onDestroy = new Subject<void>();

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

  constructor(private globalEvents: GlobalEventService,public dialog: MatDialog, private route: ActivatedRoute,private router: Router,private spinner: NgxSpinnerService, public auth:AuthService) { }

  ngOnInit(): void {

    // ----------------------------search field debounce start
    this.searchControl.valueChanges
    .pipe(debounceTime(500))
    .subscribe(newValue => this.search = newValue);
    // ---------------------------search field debounce end
    this.getList();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }


  getList(event?:any){

    let eventData = event?event:{pageSize:this.pageSize,pageIndex: this.current_page};
    this.spinner.show();
    this.auth.getAppartmentsData(eventData, this.search)
             .pipe(takeUntil(this._onDestroy))
             .subscribe(
               res =>{
                 this.listData = res.data.data;
                 this.total = res.data.total;
                 this.current_page  = res.data.current_page-1;
               },
               error=>{},
               ()=>{ this.spinner.hide();}
              );
  }

  loginThisUser(user:any){

    this.spinner.show();
      this.auth.loginNewUser(user).subscribe({
        next:(res)=>{ window.location.href="dashboard"  },
        error:(error)=>{},
        complete:()=>{ this.spinner.show();}
      });


  }

  openDialog(data = {}) {
    // console.log(data);
    const dialogRef = this.dialog.open(CreateComponent, {
      height: '90%',
      data});

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      this.getList();
    });
  }

   // Dialog for delete Template
   openDialogDelete(item: any): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: {message: 'Are you sure, you want to delete?', heading: 'Confirmation'}
    });

    dialogRef.afterClosed().pipe(takeUntil(this._onDestroy)).subscribe(result => {
     if(result) {this.deleteItem(item);}

    });
  }

    // Dialog for delete Template
    openDialogTag(item: any): void {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '250px',
        data: {message: 'Are you sure, you want to tag this UKN', heading: 'Confirmation'}
      });

      dialogRef.afterClosed().pipe(takeUntil(this._onDestroy)).subscribe(result => {
       if(result) {this.tag(item);}

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

  deleteItem(item: any){
    this.spinner.show();
    this.auth.deleteAppartments(item).pipe(takeUntil(this._onDestroy)).subscribe(
      (res:any)=>{
        this.globalEvents.broadcast('serverMsg',res.message);
        this.remove(item);
      },
      (error)=>{},
      ()=>{this.spinner.hide();}
    );
  }

  residencyStatus(item: any){
    this.spinner.show();
    this.auth.residencyStatus(item.id).pipe(takeUntil(this._onDestroy)).subscribe(
      (res:any)=>{
        this.openResidencyStatusDialog(res.data, item);
        this.globalEvents.broadcast('serverMsg',res.message);
      },
      (error)=>{this.spinner.hide();},
      ()=>{this.spinner.hide();}
    );
  }

   // Dialog for payment status Template
   openResidencyStatusDialog(item: any, residency:any): void {
    const dialogRef = this.dialog.open(PaymentStatusComponent, {

        width: '750%',
        data: item
    });

    dialogRef.afterClosed().pipe(takeUntil(this._onDestroy)).subscribe(result => {
     if(result && result['action']=='receivePayment') {
      this.receivePayment(item, residency);

     }

    });
  }

  receivePayment(payment:any, residency:any){

    const dialogRef = this.dialog.open(ReceivePaymentComponent, {
      data: {payment, residency}
  });

  dialogRef.afterClosed().pipe(takeUntil(this._onDestroy)).subscribe(result => {
   if(result) {}

  });

  }


  remove(element:any) {
    const index = this.listData.indexOf(element);

    if (index !== -1) {
      this.listData.splice(index, 1);
    }
  }

  // -----------------------------------------------Work for data sorting-------------------------

  sortData(sort: any ){
    // console.log(sort);
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

}
