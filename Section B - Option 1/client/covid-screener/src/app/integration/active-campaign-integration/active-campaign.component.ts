import { Component, ViewChild, ElementRef, OnInit, OnDestroy, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Toast, ToasterService } from 'angular2-toaster';
import { ErrorHandler } from 'src/app/utilities/error-handler/error-handler';
import { AppComponent } from 'src/app/app.component';
import { Router } from '@angular/router';
import { ActiveCampaignIntegrationService } from './active-campaign.service';

declare var $: any;

@Component({
    selector: 'app-active-campaign-integration',
    templateUrl: './active-campaign.component.html',
    styleUrls: ['./active-campaign.component.css']
})
export class ActiveCampaignIntegrationComponent implements OnInit, OnDestroy {

    @Output()
    complete: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild('form')
    public activeCampaignForm: ElementRef;

    public apiKey: string;
    public apiUrl: string;
    public listId: number;
    public lists: any[];
    public startPage: boolean;

    constructor(
        private activeCampaignIntegrationService: ActiveCampaignIntegrationService,
        private toasterService: ToasterService,
        private errorHandler: ErrorHandler,
        private router: Router) { }

    ngOnInit() {
        this.startPage = true;
        this.listId = 0;
        this.lists = [];
    }

    ngOnDestroy() {
        this.activeCampaignIntegrationService = undefined;
        this.toasterService = undefined;
        this.errorHandler = undefined;
        this.router = undefined;
        this.apiKey = undefined;
        this.apiUrl = undefined;
        this.listId = undefined;
        this.lists = undefined;
        this.startPage = undefined;
        this.activeCampaignForm = undefined;
    }

    getLists(): void {

        if (!this.apiUrl || this.apiUrl === '' || !this.apiKey || this.apiKey === '') {
            const toast: Toast = {

                type: 'error',
                title: 'Error',
                body: 'You need to provide the API Key and API URL as provided by Active Campaign',
                showCloseButton: true
            };

            this.toasterService.pop(toast);
        } else {
            $('#loader-active-campaign').modal('show').on('shown.bs.modal', () => {

                this.lists = [];

                this.activeCampaignIntegrationService.requestLists(this.apiKey, this.apiUrl)
                    .then(data => {

                        if (data?.data?.lists) {

                            data?.data?.lists.forEach(element => this.lists.push(element));
                        }

                        $('#loader-active-campaign').modal('hide').on('hidden.bs.modal', () => {
                            $('#loader-active-campaign').off();
                        });
                    })
                    .catch(err => {
                        $('#loader-active-campaign').modal('hide').on('hidden.bs.modal', () => {

                            this.errorHandler.handleError(err, 'ActiveCampaignIntegration');
                            $('#loader-active-campaign').off();
                        });
                    });
            });
        }
    }

    storeIntegration(): void {

        this.activeCampaignForm.nativeElement.classList.add('was-validated');

        if (this.activeCampaignForm.nativeElement.checkValidity() === true) {
            $('#loader-active-campaign').modal('show').on('shown.bs.modal', () => {

                this.activeCampaignIntegrationService.storeData(this.apiKey, this.apiUrl, this.listId)
                    .then(data => {

                        if (data.status === 0) {
                            const toast: Toast = {

                                type: 'success',
                                title: 'Success',
                                body: 'Integration linked successfully. You will be signed out to complete the setup.',
                                showCloseButton: true,
                                onHideCallback: () => {
                                    $('#loader-active-campaign').modal('hide').on('hidden.bs.modal', () => {

                                        $('#loader-active-campaign').off();
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
                        $('#loader-active-campaign').modal('hide').on('hidden.bs.modal', () => {

                            this.errorHandler.handleError(err, 'ActiveCampaignIntegration');
                            $('#loader-active-campaign').off();
                        });
                    });
            });
        }
    }

    startIntegration() {
        this.startPage = false;
    }
}