import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { AuthGuard } from './utilities/route-guards/auth-guard';
import { VerifyAccountComponent } from './user/verify-account/verify-account.component';
import { UserForgotPasswordComponent } from './user/forgot-password/user-forgot-password.component';
import { DownloadExportFileComponent } from './integration/download-export-file/download-export-file.component';
import { PrivacyPolicyComponent } from './utilities/privacy-policy/privacy-policy.component';
import { ContactUsComponent } from './utilities/contact-us/contact-us.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  }, 
  {
    path: 'verify/:id',
    component: VerifyAccountComponent
  },
  {
    path: 'forgot-password/:id',
    component: UserForgotPasswordComponent
  },
  {
    path: 'forgot-password',
    component: UserForgotPasswordComponent
  },
  {
    path: 'data-export/:fileName',
    component: DownloadExportFileComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'contact-us',
    component: ContactUsComponent
  },
  {
    path: 'contact',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./candidate-screening/candidate-screening.module').then(
        (m) => m.CandidateScreeningModule
      ),
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'integration',
    loadChildren: () => import('./integration/integration.module').then((m) => m.IntegrationModule),
  },
  {
    path: '**',
    redirectTo: '/contact/profile-list'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
