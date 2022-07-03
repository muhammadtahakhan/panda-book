import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KycFormComponent } from './kyc-form/kyc-form.component';
import { MainComponent } from './main/main.component';
import { TagUserComponent } from './tag-user/tag-user.component';
import { UknListComponent } from './ukn-list/ukn-list.component';
import { UserListComponent } from './user-list/user-list.component';

const routes: Routes = [

  { path:'', component: MainComponent,
        // canActivateChild: [ AuthGuardService ],
        // canActivate : [AuthGuardService],
        children:[
            // { path: '',  redirectTo: 'list' },
            { path: '',    component: UserListComponent, data: { routeRole: 'admin', currentModule: 'users'  }},
            { path: 'ukn',    component: UknListComponent, data: { routeRole: 'admin', currentModule: 'ukn'  }},
            { path: 'kyc-form/:userId',    component: KycFormComponent, data: { routeRole: 'admin', currentModule: 'kyc-form'  }},
            { path: 'kyc-form',    component: KycFormComponent, data: { routeRole: 'admin', currentModule: 'kyc-form'  }},
          ]
        },

        ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministratorRoutingModule { }
