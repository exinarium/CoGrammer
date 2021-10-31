import { Injectable } from '@angular/core';
import ObjectID from 'bson-objectid';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class GoogleSheetsIntegrationService {

    constructor(private httpClient: HttpClient) { }

    async sendAuthCode(code: string): Promise<any> {

        let corsHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });

        const request = {
            id: new ObjectID(),
            produceMessage: true,
            accessCode: code,
        }

        return this.httpClient.post(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/googlesheetintegration/`,
        request,    
        { headers: corsHeaders }).toPromise();
    }
}