import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardComponent } from './main/guard.component';

const routes: Routes = [{ path: '', component: GuardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuardRoutingModule { }
