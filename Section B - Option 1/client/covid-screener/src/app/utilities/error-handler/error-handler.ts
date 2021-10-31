import { HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { Toast, ToasterService } from 'angular2-toaster';
import { Injectable, isDevMode } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Injectable()
export class ErrorHandler {

    constructor(
        private httpClient: HttpClient,
        private toasterService: ToasterService,
        private router: Router
    ) { }

    /*
    * This method will handle any errors passed to it an will give us a generic way of dealing with errors.
    */
    async handleError(err: any, componentName: string) {

        let sendErrorToServer = true;
        let message = '';

        if (err instanceof HttpErrorResponse) {

            if (err.status === 401 || err.status === 403) {
                sendErrorToServer = false;
                sessionStorage.removeItem('token');
                AppComponent.isLoggedIn = false;
                this.router.navigate(['/'], { replaceUrl: true });
            }

            const errorSplit = err?.error?.message?.split(':');

            if(errorSplit && errorSplit[1]) {

                err.error.message = errorSplit[1];
            }

            message = err?.error?.message && err?.error?.message !== '' ? err?.error?.message : `An unexpected error occurred. Response code: ${err.status}. 
            Response Status: ${err.statusText}`;

            const toast: Toast = {
                type: 'error',
                title: 'Error',
                body: message,
                showCloseButton: true
            };

            this.toasterService.pop(toast);

        } else if (err instanceof Error) {

            const errorSplit = err?.message?.split(':');

            if(errorSplit && errorSplit[1]) {

                err.message = errorSplit[1];
            }

            message = err.message && err.message !== '' ? err.message : `An unexpected error occurred: ${err.name}`;

            const toast: Toast = {
                type: 'error',
                title: 'Error',
                body: message,
                showCloseButton: true
            };

            this.toasterService.pop(toast);
        }

        // //Log the error serverside for monitoring purposes
        // if (sendErrorToServer) {

        //     const token = sessionStorage.getItem('token');

        //     const headers = new HttpHeaders({
        //         'Authorization': `Bearer ${token}`,
        //         'Access-Control-Allow-Origin': '*',
        //         'Access-Control-Allow-Headers': 'Content-Type',
        //         'Content-Type': 'application/json'
        //     });

        //     this.httpClient.post(`http://${environment.host}:${environment.port}/api/v1/Log`, JSON.stringify({

        //         LogDateUtc: new Date(),
        //         StorageDate: new Date,
        //         Message: `An error occurred in ${componentName}: ${message}`,
        //         Priority: 2,
        //         LogTypeValue: 2,
        //         Details: {
        //             Application: `Client Side - Component: ${componentName}`,
        //             ApplicationContext: isDevMode ? 'Development' : 'Production',
        //             IsOnline: true,
        //             Url: this.router.url
        //         }

        //     }), { headers });
        // }
    }
}
