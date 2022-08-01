import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './residency/list/list.component';
import { GuardComponent } from './main/guard.component';

const routes: Routes = [{ path: '', component: GuardComponent,
            children:[
              // { path: '',  redirectTo: 'list' },
              { path: 'list',    component: ListComponent, data: { routeRole: '[admin, guard]', currentModule: 'users'  }},
              { path: '**',  redirectTo: 'list' },
            ]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuardRoutingModule { }
