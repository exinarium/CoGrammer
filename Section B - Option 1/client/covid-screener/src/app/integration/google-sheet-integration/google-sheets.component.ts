import { Component, ViewChild, ElementRef, OnInit, OnDestroy, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { GoogleSheetsIntegrationService } from './google-sheets.service';
import { Toast, ToasterService } from 'angular2-toaster';
import { ErrorHandler } from 'src/app/utilities/error-handler/error-handler';
import { AppComponent } from 'src/app/app.component';
import { Router } from '@angular/router';
import { SocialAuthService, GoogleLoginProvider } from 'angularx-social-login';

declare var $: any;

@Component({
    selector: 'app-google-sheets-integration',
    templateUrl: './google-sheets.component.html',
    styleUrls: ['./google-sheets.component.css']
})
export class GoogleSheetsIntegrationComponent implements OnInit, OnDestroy {

    @Output()
    complete: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(
        private googleSheetService: GoogleSheetsIntegrationService,
        private toasterService: ToasterService,
        private errorHandler: ErrorHandler,
        private router: Router,
        private authService: SocialAuthService) { }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.googleSheetService = undefined;
        this.toasterService = undefined;
        this.errorHandler = undefined;
        this.router = undefined;
        this.authService = undefined;
    }

    signInWithGoogle(): void {

        $('#loader-google-sheets').modal('show').on('shown.bs.modal', () => {

            this.authService.signIn(GoogleLoginProvider.PROVIDER_ID, { scope: 'https://www.googleapis.com/auth/drive.file', offline_access: true })
                .then((authData) => {
                    if (authData && authData.authorizationCode) {

                        this.googleSheetService.sendAuthCode(authData?.authorizationCode)
                            .then(data => {

                                const toast: Toast = {

                                    type: 'success',
                                    title: 'Success',
                                    body: 'Integration linked successfully. You will be signed out to complete the setup.',
                                    showCloseButton: true,
                                    onHideCallback: () => {
                                        $('#loader-google-sheets').modal('hide').on('hidden.bs.modal', () => {

                                            $('#loader-google-sheets').off();
                                            this.complete.emit(true);
                                            sessionStorage.clear();
                                            AppComponent.isLoggedIn = false;
                                            this.router.navigate([''], { replaceUrl: true });
                                        });
                                    }
                                }

                                this.toasterService.pop(toast);
                            })
                            .catch(err => {
                                $('#loader-google-sheets').modal('hide').on('hidden.bs.modal', () => {

                                    this.errorHandler.handleError(err, 'GoogleSheetIntegration');
                                    $('#loader-google-sheets').off();
                                });
                            });
                    } else {
                        const toast: Toast = {

                            type: 'error',
                            title: 'Error',
                            body: 'Authentication with Google failed',
                            showCloseButton: true,
                            onHideCallback: () => {
                                $('#loader-google-sheets').modal('hide').on('hidden.bs.modal', () => {
                                    $('#loader-google-sheets').off();
                                });
                            }
                        }

                        this.toasterService.pop(toast);
                    }
                })
                .catch((err) => {
                    $('#loader-google-sheets').modal('hide').on('hidden.bs.modal', () => {

                        this.errorHandler.handleError(err, 'GoogleSheetIntegration');
                        $('#loader-google-sheets').off();
                    });
                });
        });
    }
}