import { HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse, HttpInterceptor } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, finalize } from "rxjs";
import { AuthService } from "../service/auth.service";
import { GlobalEventService } from "./global-event.service";
import {  throwError } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";


@Injectable({
    providedIn: 'root'
  })
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private spinner: NgxSpinnerService,private router: Router, private globalEvents:GlobalEventService,private authenticationService: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // broad cast event on start http
         this.globalEvents.broadcast('setHttpStatus',{status:'start'});

        return next.handle(request).pipe(
          catchError(err => {

            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.globalEvents.broadcast('serverMsg','please login again');
                // this.authenticationService.clearUserData();
                this.router.navigate(['/login']);
                this.spinner.hide();
                // location.reload(true);
            }
            //  debugger;
            const error = err.error.message || err.statusText;
            // return throwError(() => new Error('401'));
            console.log('throw error back to to the subscriber');
            // return throwError(() => error);
            // return next.handle(request);
            throw err;
        }),
        finalize(() => {
        //    broad cast event on finish http
            this.globalEvents.broadcast('setHttpStatus',{status:'final'});
          })

    )
    }
}
