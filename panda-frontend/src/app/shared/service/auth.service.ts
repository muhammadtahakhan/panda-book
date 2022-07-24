import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { map, Observable } from 'rxjs';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { BaseService } from './baseService';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
  currentUser: any;
  currentUserToken: any;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    super();

  }

  register(data: {}): Observable<any>{
    return  this.http.post(this.url+'register',  data);
  }

  verifyEmail(data: {}): Observable<any>{
    return  this.http.post(this.url+'verifyemail',  data);
  }

  getstats(){
    return  this.http.get(this.url+'statics')
  }

  loginPost(data: {}): Observable<any> {

    return  this.http.post(this.url+'login',  data, this.httpOptions)
    .pipe(
      map((user: any) => {
        // login successful if there's a jwt token in the response
        if (user.success) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
           this.currentUserToken = JSON.stringify(user.success.token);
           this.currentUser = user.success.user;

          //-----  to set role type in every privilegename ends
           this.cookieService.set( 'currentUserToken', this.currentUserToken );
        }

        return user;
      })
    );

  }

  GenerateOtp(data: {}): Observable<any>{
    return  this.http.post('https://pmex.kasb.com/api_nccpl/accounts/getAccountInfoKyc',  data, )

  }

  verifyOtp(data: {}){
    return  this.http.post('https://pmex.kasb.com/api_nccpl/accounts/verifyOTP',  data, )
  }

  submitData(data: {}){
    return  this.http.post('https://pmex.kasb.com/api_nccpl/accounts/data',  data, )
  }

  getUserData(paramsData = {pageSize:'',pageIndex: '0'}, search='', filter=''): Observable<any>{
    let params = new HttpParams();
    params = params.append('filter', filter);
    params = params.append('page_size', paramsData.pageSize ? paramsData.pageSize : '');
    params = params.append('page_index', paramsData.pageIndex ? (parseInt(paramsData.pageIndex) + 1).toString() : '1');
    if(search){
      params = params.append('search', search);
    }

    return  this.http.get(this.url+'users', {params: params})
    // .pipe( map((user:any) =>{ this.currentUser = user; return user;}) )
  }

  getCurrrentUserData(): Observable<any>{
    return  this.http.get(this.url+'user')
    .pipe( map((user:any) =>{ this.currentUser = user; return user;}) )
  }

  updateUserData(data: {}){
    return  this.http.post(this.url+'updatedetails',  data, this.httpOptions);
  }

  logout(): Observable<any>{
    return  this.http.get(this.url+'logout');
  }


  sendPassCode(data: {}): Observable<any>{
    return  this.http.post(this.url+'password/create',  data);
  }

  resetPass(data: {}): Observable<any>{
    return  this.http.post(this.url+'password/reset',  data);
  }

  loginNewUser(data: {}){
    return  this.http.post(this.url+'changeuser',  data)
    .pipe(
      map((user: any) => {
        // login successful if there's a jwt token in the response
        if (user.success) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
           this.currentUser = JSON.stringify(user.success.token);

          //-----  to set role type in every privilegename ends
           this.cookieService.set( 'currentUserToken', this.currentUser );
        }

        return user;
      })
    );
  }

  getUknData(paramsData = {pageSize:'',pageIndex: '0'}, search=''): Observable<any>{
    let params = new HttpParams();
    params = params.append('page_size', paramsData.pageSize ? paramsData.pageSize : '');
    params = params.append('page_index', paramsData.pageIndex ? (parseInt(paramsData.pageIndex) + 1).toString() : '1');
    if(search){
      params = params.append('search', search);
    }

    return  this.http.get(this.url+'ukn', {params: params})
    // .pipe( map((user:any) =>{ this.currentUser = user; return user;}) )
  }

  createUkn(data: any){
    if(data?.id){
      return  this.http.put(this.url+'ukn',  data, this.httpOptions);
    }else{
      return  this.http.post(this.url+'ukn',  data, this.httpOptions);
    }
  }

  deleteUkn(data: any): Observable<any> {
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: data
      };

      return this.http.delete(this.url+'ukn',  httpOptions);
   }

   tagUkn(data:any): Observable<any> {
    let postData = {"UIN":data?.uin||data?.UIN, "UKN":data?.ukn,  "optCode": data?.otp, "TAG_DOCUMENT":data?.tag_document};
      return this.http.post('https://pmex.kasb.com/api_nccpl/accounts/tag',  postData, this.httpOptions);
   }

   resendOtp(data:any): Observable<any> {
    let postData = {"UIN":data?.uin||data?.UIN, "OTP":""};
    return  this.http.post('https://pmex.kasb.com/api_nccpl/accounts/resendOTP',  postData, this.httpOptions);
   }

   regenerateOtp(data:any): Observable<any> {
     let postData = {"UIN":data?.uin||data?.UIN, "OTP":""};
     return  this.http.post('https://pmex.kasb.com/api_nccpl/accounts/generateOTP',  postData, this.httpOptions);
    }

    getUserById(userId:number){
      return  this.http.get(this.url+'user/'+userId);
    }

    // ========================================================================================
    getAppartmentsData(paramsData = {pageSize:'',pageIndex: '0'}, search=''): Observable<any>{
      let params = new HttpParams();
      params = params.append('page_size', paramsData.pageSize ? paramsData.pageSize : '');
      params = params.append('page_index', paramsData.pageIndex ? (parseInt(paramsData.pageIndex) + 1).toString() : '1');
      if(search){
        params = params.append('search', search);
      }

      return  this.http.get(this.url+'appartment', {params: params})
      // .pipe( map((user:any) =>{ this.currentUser = user; return user;}) )
    }

    deleteAppartments(data: any): Observable<any> {
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: data
      };

      return this.http.delete(this.url+'appartment',  httpOptions);
   }

   createoOrUpdateAppartments(data: any): Observable<any> {
    debugger;
    if(data.id){
      return this.http.put(this.url+'appartment',  data, this.httpOptions);
    }else{
      return this.http.post(this.url+'appartment',  data, this.httpOptions);
    }
 }


}
