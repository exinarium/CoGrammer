import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { AuthGuard } from './utilities/route-guards/auth-guard';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AdminGuard } from './utilities/route-guards/admin-guard';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { TutorialComponent } from './utilities/tutorial/tutorial.component';
import { IntegrationModule } from './integration/integration.module';
import { PrivacyPolicyComponent } from './utilities/privacy-policy/privacy-policy.component';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { ContactUsComponent } from './utilities/contact-us/contact-us.component';
import { ContactUsService } from './utilities/contact-us/contact-us.service';

@NgModule({
  declarations: [AppComponent, TutorialComponent, PrivacyPolicyComponent, ContactUsComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ToasterModule,
    AppRoutingModule,
    UserModule,
    IntegrationModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    SocialLoginModule
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    ToasterService,
    AuthGuard,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '126705087213-f3du57uc40i8bte222dlhu3d2eq2mv7o.apps.googleusercontent.com'
            ),
          }
        ],
      } as SocialAuthServiceConfig
    },
    ContactUsService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
