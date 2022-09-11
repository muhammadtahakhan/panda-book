import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { AngularMaterialModule } from './material.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './shared/_helpers/jwt.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ErrorInterceptor } from './shared/_helpers/error.interceptor';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { CookieService } from 'ngx-cookie-service';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings, RECAPTCHA_SETTINGS } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';
import { DialogComponent } from './shared/_components/dialog/dialog.component';
import { ScrollingModule } from '@angular/cdk/scrolling';


const MY_FORMATS = {
  parse: {
    dateInput: 'DD MMMM YYYY',
  },
  display: {
    dateInput: 'DD MMMM YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgetpasswordComponent,
    ResetpasswordComponent,
    DialogComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    RecaptchaModule,
    RecaptchaFormsModule,

  ],
  providers: [CookieService,
                { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
                { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
                { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
                {
                  provide: RECAPTCHA_SETTINGS,
                  useValue: {
                    siteKey: environment.recaptcha.siteKey,
                  } as RecaptchaSettings,
                },
              ],
  bootstrap: [AppComponent],
  entryComponents:[DialogComponent],
})
export class AppModule { }
