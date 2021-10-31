import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserRoutingModule } from './user-routing.module';
import { UserForgotPasswordComponent } from './forgot-password/user-forgot-password.component';
import { LoginService } from './login/login.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler } from '../utilities/error-handler/error-handler';
import { UserListComponent } from './user-list/user-list.component';
import { UserListService } from './user-list/user-list.service';
import { AuthGuard } from '../utilities/route-guards/auth-guard';
import { AdminGuard } from '../utilities/route-guards/admin-guard';
import { UserProfileService } from './user-profile/user-profile.service';
import { VerifyAccountComponent } from './verify-account/verify-account.component';
import { VerifyAccountService } from './verify-account/verify-account.service';
import { UserForgotPasswordService } from './forgot-password/user-forgot-password.service';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { UpdatePasswordService } from './update-password/update-password.service';
import { BillingComponent } from './billing/billing.component';
import { PaymentFailure } from './billing/payment-failure/payment-failure.component';
import { PaymentComplete } from './billing/payment-complete/payment-complete.component';
import { BillingService } from './billing/billing.service';

@NgModule({
  declarations: [
    LoginComponent,
    UserProfileComponent,
    UserForgotPasswordComponent,
    UserListComponent,
    UserProfileComponent,
    VerifyAccountComponent,
    UpdatePasswordComponent,
    BillingComponent,
    PaymentFailure,
    PaymentComplete
  ],
  imports: [
    CommonModule,
    FormsModule,
    UserRoutingModule,
    HttpClientModule,
  ],
  providers: [
    LoginService,
    ErrorHandler,
    AuthGuard,
    AdminGuard,
    UserListService,
    UserProfileService,
    VerifyAccountService,
    UserForgotPasswordService,
    UpdatePasswordService,
    BillingService
  ],
  bootstrap: [],
})
export class UserModule { }
