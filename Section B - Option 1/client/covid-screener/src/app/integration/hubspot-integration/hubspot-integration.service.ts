import { Injectable } from '@angular/core';
import ObjectID from 'bson-objectid';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class HubspotIntegrationService {

    constructor(private httpClient: HttpClient) { }

    async storeData(apiKey: string): Promise<any> {

        let corsHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });

        const requestId = new ObjectID();
        
        const request = {
            id: new ObjectID(),
            apiKey: apiKey
        }

        return this.httpClient.post(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/hubspotintegration/`,  
        request,
        { headers: corsHeaders }).toPromise();
    }
}