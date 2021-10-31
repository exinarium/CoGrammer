import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserListComponent } from './user-list/user-list.component';
import { AuthGuard } from '../utilities/route-guards/auth-guard';
import { AdminGuard } from '../utilities/route-guards/admin-guard';
import { BillingComponent } from './billing/billing.component';
import { PaymentComplete } from './billing/payment-complete/payment-complete.component';
import { PaymentFailure } from './billing/payment-failure/payment-failure.component';

const routes: Routes = [
  {
    path: '',
    component: UserProfileComponent,
  },
  {
    path: 'profile/:id',
    component: UserProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'team',
    component: UserListComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'billing/complete',
    component: PaymentComplete
  },
  {
    path: 'billing/failure',
    component: PaymentFailure
  },
  {
    path: 'billing',
    component: BillingComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: '**',
    redirectTo: '/contact/profile-list'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule { }
