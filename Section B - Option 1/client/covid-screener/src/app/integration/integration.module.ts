import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler } from '../utilities/error-handler/error-handler';
import { AuthGuard } from '../utilities/route-guards/auth-guard';
import { AdminGuard } from '../utilities/route-guards/admin-guard';
import { IntegrationRoutingModule } from './integration-routing.module';
import { IntegrationComponent } from './integration.component';
import { ExcelIntegrationComponent } from './excel-integration/excel-integration.component';
import { ExcelIntegrationService } from './excel-integration/excel-integration.service';
import { DownloadExportFileComponent } from './download-export-file/download-export-file.component';
import { DownloadExportFileService } from './download-export-file/download-export-file.service';
import { GoogleSheetsIntegrationComponent } from './google-sheet-integration/google-sheets.component';
import { GoogleSheetsIntegrationService } from './google-sheet-integration/google-sheets.service';
import { ActiveCampaignIntegrationService } from './active-campaign-integration/active-campaign.service';
import { ActiveCampaignIntegrationComponent } from './active-campaign-integration/active-campaign.component';
import { HubspotIntegrationComponent } from './hubspot-integration/hubspot-integration.component';
import { HubspotIntegrationService } from './hubspot-integration/hubspot-integration.service';

@NgModule({
  declarations: [
    IntegrationComponent,
    ExcelIntegrationComponent,
    DownloadExportFileComponent,
    GoogleSheetsIntegrationComponent,
    ActiveCampaignIntegrationComponent,
    HubspotIntegrationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IntegrationRoutingModule
  ],
  providers: [
    ErrorHandler,
    AuthGuard,
    AdminGuard,
    ExcelIntegrationService,
    DownloadExportFileService,    
    GoogleSheetsIntegrationService,
    ActiveCampaignIntegrationService,
    HubspotIntegrationService
  ],
  bootstrap: [],
})
export class IntegrationModule { }
