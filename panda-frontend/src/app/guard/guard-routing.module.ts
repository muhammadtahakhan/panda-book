import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { GuardComponent } from './main/guard.component';

const routes: Routes = [{ path: '', component: GuardComponent,
            children:[
              // { path: '',  redirectTo: 'list' },
              { path: 'list',    component: ListComponent, data: { routeRole: '[admin, guard]', currentModule: 'users'  }},
              { path: 'create',    component: CreateComponent, data: { routeRole: '[admin, guard]', currentModule: 'ukn'  }},
              { path: '**',  redirectTo: 'list' },
            ]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuardRoutingModule { }
