import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import ObjectID from 'bson-objectid';
import { ExportType } from './models/export-type';

@Injectable()
export class ExcelIntegrationService {

    constructor(private httpClient: HttpClient) { }

    export(exportType: ExportType): Promise<any> {

        let corsHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });

        const emailAddress = JSON.parse(sessionStorage.getItem('user'))?.email;

        const request = {
            id: new ObjectID(),
            produceMessage: true,
            emailAddress: emailAddress,
            exportType: exportType
        }

        return this.httpClient.post(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/excelintegration/`,
        request,    
        { headers: corsHeaders }).toPromise();
    }
}