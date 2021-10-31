import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { DownloadExportFileService } from './download-export-file.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandler } from 'src/app/utilities/error-handler/error-handler';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-download-export-file',
    templateUrl: './download-export-file.component.html',
    styleUrls: ['./download-export-file.component.css']
})
export class DownloadExportFileComponent implements OnDestroy, AfterViewInit {

    private fileName: string;
    downloading: boolean = true;
    complete: boolean = false;
    error: boolean = false;

    constructor(
        private downloadFileService: DownloadExportFileService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private errorHandler: ErrorHandler
    ) { }

    ngOnDestroy() {
        this.downloadFileService = undefined;
        this.router = undefined;
        this.fileName = undefined;
        this.activatedRoute = undefined;
        this.errorHandler = undefined;
        this.downloading = undefined;
        this.error = undefined;
        this.complete = undefined;
    }

    ngAfterViewInit() {
        this.fileName = this.activatedRoute.snapshot.paramMap.get('fileName');

        this.downloadFileService.download(this.fileName).subscribe(response => {
            const blob = new Blob([response], { type: 'application/ms-excel' });
            saveAs(blob, this.fileName);
        },
            (error) => {
                this.downloading = false;
                this.error = true;
            },
            () => {
                this.downloading = false;
                this.complete = true;
            });
    }
}