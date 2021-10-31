import { Component, OnDestroy, OnInit } from '@angular/core';
import { isBuffer } from 'util';

declare var $: any;

@Component({
    selector: 'app-integration-view',
    templateUrl: './integration.component.html',
    styleUrls: ['./integration.component.css']
})
export class IntegrationComponent implements OnDestroy, OnInit {

    isAdminUser: boolean = false;
    googleStatus: boolean = false;
    activeCampaignStatus: boolean = false;
    hubspotStatus: boolean = false;
    
    allowExcelIntegration: boolean;
    allowGoogleIntegration: boolean;
    allowActiveCampaignIntegration: boolean;
    allowHubspotIntegration: boolean;

    ngOnInit() {

        const user = JSON.parse(sessionStorage.getItem('user'));

        if(user) {
            this.isAdminUser = user.isAdminUser;
            this.googleStatus = user?.activeIntegrations?.google;
            this.activeCampaignStatus = user?.activeIntegrations?.activeCampaign;
            this.hubspotStatus = user?.activeIntegrations?.hubspot;

            this.allowExcelIntegration = user?.paymentPlan?.allowExcelIntegration;
            this.allowGoogleIntegration = user?.paymentPlan?.allowGoogleIntegration;
            this.allowActiveCampaignIntegration = user?.paymentPlan?.allowActiveCampaignIntegration;
            this.allowHubspotIntegration = user?.paymentPlan?.allowHubspotIntegration;
        }
    }

    ngOnDestroy() {

        this.isAdminUser = undefined;
        this.googleStatus = undefined;
        this.activeCampaignStatus = undefined;
        this.hubspotStatus = undefined;
    
        this.allowExcelIntegration = undefined;
        this.allowGoogleIntegration = undefined;
        this.allowActiveCampaignIntegration = undefined;
        this.allowHubspotIntegration = undefined;
    }

    exportExcelData() {

        $('#export-data-modal').modal('show');
    }

    closeExcelData() {
        $('#export-data-modal').modal('hide');
    }

    authorizeGoogleSheets() {

        $('#google-sheets-modal').modal('show');
    }

    closeGoogleSheets() {
        $('#google-sheets-modal').modal('hide');
    }

    setupActiveCampaign() {

        $('#active-campaign-modal').modal('show');
    }

    closeActiveCampaign() {
        $('#active-campaign-modal').modal('hide');
    }

    setupHubspot() {

        $('#hubspot-modal').modal('show');
    }

    closeHubspot() {
        $('#hubspot-modal').modal('hide');
    }
}