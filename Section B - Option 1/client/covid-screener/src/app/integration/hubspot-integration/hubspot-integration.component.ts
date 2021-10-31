import { Component, ViewChild, ElementRef, OnInit, OnDestroy, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Toast, ToasterService } from 'angular2-toaster';
import { ErrorHandler } from 'src/app/utilities/error-handler/error-handler';
import { AppComponent } from 'src/app/app.component';
import { Router } from '@angular/router';
import { HubspotIntegrationService } from './hubspot-integration.service';

declare var $: any;

@Component({
    selector: 'app-hubspot-integration',
    templateUrl: './hubspot-integration.component.html',
    styleUrls: ['./hubspot-integration.component.css']
})
export class HubspotIntegrationComponent implements OnInit, OnDestroy {

    @Output()
    complete: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild('form')
    public hubspotForm: ElementRef;

    public apiKey: string;
    public startPage: boolean;

    constructor(
        private hubspotIntegrationService: HubspotIntegrationService,
        private toasterService: ToasterService,
        private errorHandler: ErrorHandler,
        private router: Router) { }

    ngOnInit() {
        this.startPage = true;
    }

    ngOnDestroy() {
        this.hubspotIntegrationService = undefined;
        this.toasterService = undefined;
        this.errorHandler = undefined;
        this.router = undefined;
        this.apiKey = undefined;
        this.startPage = undefined;
        this.hubspotForm = undefined;
    }

    storeIntegration(): void {

        this.hubspotForm.nativeElement.classList.add('was-validated');

        if (this.hubspotForm.nativeElement.checkValidity() === true) {
            $('#loader-hubspot').modal('show').on('shown.bs.modal', () => {

                this.hubspotIntegrationService.storeData(this.apiKey)
                    .then(data => {

                        if (data.status === 0) {
                            const toast: Toast = {

                                type: 'success',
                                title: 'Success',
                                body: 'Integration linked successfully. You will be signed out to complete the setup.',
                                showCloseButton: true,
                                onHideCallback: () => {
                                    $('#loader-hubspot').modal('hide').on('hidden.bs.modal', () => {

                                        $('#loader-hubspot').off();
                                        this.complete.emit(true);
                                        sessionStorage.clear();
                                        AppComponent.isLoggedIn = false;
                                        this.router.navigate([''], { replaceUrl: true });
                                    });
                                }
                            };

                            this.toasterService.pop(toast);
                        }
                    })
                    .catch(err => {
                        $('#loader-hubspot').modal('hide').on('hidden.bs.modal', () => {

                            this.errorHandler.handleError(err, 'HubspotIntegrationComponent');
                            $('#loader-hubspot').off();
                        });
                    });
            });
        }
    }

    startIntegration() {
        this.startPage = false;
    }
}