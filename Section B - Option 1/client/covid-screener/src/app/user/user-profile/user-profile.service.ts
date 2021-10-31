import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import ObjectID from 'bson-objectid';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserProfileService {

    constructor(private httpClient: HttpClient) { }

    createProfile(
        fullName: string,
        emailAddress: string,
        isAdminUser: any,
        activeCampaignTag: string
    ): Promise<any> {

        const corsHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });

        return this.httpClient.post(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/createuser/`,
            {
                requestId: new ObjectID(),
                name: fullName,
                email: emailAddress,
                isAdminUser: isAdminUser === "true" ? true : false,
                activeCampaignTagName: activeCampaignTag
            },
            { headers: corsHeaders }).toPromise();
    }

    editProfile(
        _id: string,
        fullName: string,
        emailAddress: string,
        isAdminUser: any,
        version: number,
        activeCampaignTag: string
    ): Promise<any> {

        const corsHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });

        return this.httpClient.put(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/updateuser/`,
            {
                requestId: new ObjectID(),
                _id,
                name: fullName,
                email: emailAddress,
                isAdminUser: Boolean(isAdminUser),
                version,
                activeCampaignTagName: activeCampaignTag
            },
            { headers: corsHeaders }).toPromise();
    }

    lookupProfile(
        id: string
    ): Promise<any> {

        const corsHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });

        return this.httpClient.get(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/userlookup/${new ObjectID()}/0/1/ /${id}`,
            { headers: corsHeaders }).toPromise();
    }
}
