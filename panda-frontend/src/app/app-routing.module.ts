
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminGuardService } from './shared/_guards/admin-guard.service';

const routes: Routes = [
  { path: '',    redirectTo: 'login',    pathMatch: 'full',  },
  { path: 'login',    component:  LoginComponent    },
  // { path: 'register',    component: RegisterComponent  },
  { path: 'forget',    component: ForgetpasswordComponent  },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)   },
  { path: 'admin', canActivate: [AdminGuardService], loadChildren: () => import('./administrator/administrator.module').then(m => m.AdministratorModule)   },
  { path: 'guard', loadChildren: () => import('./guard/guard.module').then(m => m.GuardModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
