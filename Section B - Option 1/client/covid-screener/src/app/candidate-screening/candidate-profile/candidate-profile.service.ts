import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import ObjectID from 'bson-objectid';
import { environment } from 'src/environments/environment';

@Injectable()
export class CandidateProfileService {

    constructor(private httpClient: HttpClient) { }

    createProfile(
        firstName: string,
        lastName: string,
        idNumber: string,
        telephoneNumber: string,
        emailAddress: string,
        physicalAddress: string,
        covid19Consent: boolean,
        marketingConsent: boolean
    ): Promise<any> {

        const corsHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });

        return this.httpClient.post(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/createcandidateprofile/`,
            {
                requestId: new ObjectID(),
                firstName,
                lastName,
                idNumber,
                telephoneNumber,
                emailAddress,
                physicalAddress,
                covid19Consent,
                marketingConsent
            },
            { headers: corsHeaders }).toPromise();
    }

    editProfile(
        _id: string,
        firstName: string,
        lastName: string,
        idNumber: string,
        telephoneNumber: string,
        emailAddress: string,
        physicalAddress: string,
        covid19Consent: boolean,
        marketingConsent: boolean,
        version: number
    ): Promise<any> {

        const corsHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });

        return this.httpClient.put(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/updatecandidateprofile/`,
            {
                requestId: new ObjectID(),
                _id,
                firstName,
                lastName,
                idNumber,
                telephoneNumber,
                emailAddress,
                physicalAddress,
                covid19Consent,
                marketingConsent,
                version
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

        return this.httpClient.get(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/candidateprofilelookup/${new ObjectID()}/0/1/true/ /${id}`,
            { headers: corsHeaders }).toPromise();
    }
}
