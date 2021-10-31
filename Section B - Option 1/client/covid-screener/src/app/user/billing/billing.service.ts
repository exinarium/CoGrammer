import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import ObjectID from 'bson-objectid';

@Injectable()
export class BillingService {

    constructor(private httpClient: HttpClient) { }

    async updateSubscription(newPlan: number, amount: number): Promise<any> {

        const corsHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });

        return this.httpClient.put(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/updatepayfast/`,
            {
                requestId: new ObjectID(),
                amount: amount,
                planNumber: newPlan,
                isFree: newPlan === 0
            }, { headers: corsHeaders }).toPromise();
    }

    async cancelSubscription() : Promise<any> {

        const corsHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });

        return this.httpClient.post(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/cancelpayfast/`,
            {requestId: new ObjectID()}, { headers: corsHeaders }).toPromise();
    }

    async deleteOrganization(organizationId: string) : Promise<any> {

        const corsHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });

        return this.httpClient.delete(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/deleteorganization/${new ObjectID()}/${organizationId}`,
            { headers: corsHeaders }).toPromise();
    }
}