import { Injectable } from '@angular/core';
import ObjectID from 'bson-objectid';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class ActiveCampaignIntegrationService {

    constructor(private httpClient: HttpClient) { }

    async requestLists(apiKey: string, apiUrl: string): Promise<any> {

        let corsHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });

        const request = {
            id: new ObjectID(),
            apiKey: apiKey,
            apiUrl: apiUrl
        }

        return this.httpClient.post(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/activecampaignintegration/find-lists`,  
        request,
        { headers: corsHeaders }).toPromise();
    }

    async storeData(apiKey: string, apiUrl: string, listId: number): Promise<any> {

        let corsHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });

        const requestId = new ObjectID();
        
        const request = {
            id: new ObjectID(),
            apiKey: apiKey,
            apiUrl: apiUrl,
            listId: Number(listId)
        }

        return this.httpClient.post(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/activecampaignintegration/`,  
        request,
        { headers: corsHeaders }).toPromise();
    }
}