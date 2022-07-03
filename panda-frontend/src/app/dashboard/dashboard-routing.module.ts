
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../shared/_guards/auth.guard.service';
import { MainComponent } from './main/main.component';
import { DetailProfileComponent } from './pages/detail-profile/detail-profile.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegistrationComponent } from './pages/registration/registration.component';

const routes: Routes = [

  { path:'', component: MainComponent,
        canActivateChild: [ AuthGuardService ],
        // canActivate : [AuthGuardService],
        children:[
          // { path: '',  redirectTo: ''},
          { path: '',    component: ProfileComponent,  pathMatch: 'full'},
          { path: 'pmexregistration',    component: RegistrationComponent},
          { path: 'detail-profile',    component: DetailProfileComponent},
          // { path: 'create',    component: CreateComponent, data: { routeRole: 'create', currentModule: 'category-features'  }},
          // { path: '**',  redirectTo: '' },
        ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
