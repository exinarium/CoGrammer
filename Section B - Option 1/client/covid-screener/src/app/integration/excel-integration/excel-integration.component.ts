import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ExcelIntegrationService } from './excel-integration.service';
import { ExportType } from './models/export-type';
import { ToasterService, Toast } from 'angular2-toaster';
import { Router } from '@angular/router';
import { ErrorHandler } from 'src/app/utilities/error-handler/error-handler';

declare var $: any;

@Component({
    selector: 'app-excel-integration',
    templateUrl: './excel-integration.component.html',
    styleUrls: ['./excel-integration.component.css']
})
export class ExcelIntegrationComponent implements OnDestroy {

    @Output()
    close: EventEmitter<boolean> = new EventEmitter<boolean>();

    isLoading: boolean;
    exportType = ExportType;

    constructor(private excelService: ExcelIntegrationService, private toasterService: ToasterService, private router: Router, private errorHandler: ErrorHandler) { }

    ngOnDestroy() {
        this.close = undefined;
        this.excelService = undefined;
        this.toasterService = undefined;
        this.isLoading = undefined;
        this.router = undefined;
        this.exportType = undefined;
    }

    export(exportType: ExportType) {
        $('#loader-export-data').modal('show').on('shown.bs.modal', () => {

            this.isLoading = true;
            this.excelService.export(exportType).then(data => {

                if (data) {

                    const toast: Toast = {

                        type: 'success',
                        title: 'In Progress',
                        body: 'An email will be sent with your download link',
                        showCloseButton: true,
                        onHideCallback: () => {
                            $('#loader-export-data').modal('hide').on('hidden.bs.modal', () => {
                                this.isLoading = false;

                                this.close.emit(true);

                                $('#loader-export-data').off();
                            });
                        }
                    }

                    this.toasterService.pop(toast);
                }
            })
                .catch(err => {
                    $('#loader-export-data').modal('hide').on('hidden.bs.modal', () => {
                        this.isLoading = false;
                        this.errorHandler.handleError(err, 'ExcelIntegration');

                        $('#loader-export-data').off();
                    });
                });
        });
    }
}