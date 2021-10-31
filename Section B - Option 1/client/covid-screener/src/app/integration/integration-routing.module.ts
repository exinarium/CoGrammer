import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../utilities/route-guards/auth-guard';
import { AdminGuard } from '../utilities/route-guards/admin-guard';
import { IntegrationComponent } from './integration.component';

const routes: Routes = [
  {
    path: '',
    component: IntegrationComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntegrationRoutingModule { }
