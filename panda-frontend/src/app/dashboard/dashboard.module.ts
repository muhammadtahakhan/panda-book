import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { AngularMaterialModule } from '../material.module';
import { MainComponent } from './main/main.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { VerificationComponent } from './components/verification/verification.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DetailProfileComponent } from './pages/detail-profile/detail-profile.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { RainbowDirective } from '../shared/_directives/rainbow.directive';
import { TagUserComponent } from '../administrator/tag-user/tag-user.component';



@NgModule({
  declarations: [
    MainComponent,
    ProfileComponent,
    VerificationComponent,
    DetailProfileComponent,
    RegistrationComponent,
    RainbowDirective,

  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule
  ]
})
export class DashboardModule { }
