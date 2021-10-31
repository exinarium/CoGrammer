import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import ObjectID from 'bson-objectid';
import { environment } from 'src/environments/environment';

@Injectable()
export class CandidateProfileListService {

    constructor(private httpClient: HttpClient) { }

    lookuplist(
        searchString: string = '',
        start: number = 0,
        limit: number = 0,
        showAll: boolean = true
    ): Promise<any> {

        let corsHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });

        return this.httpClient.get(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/candidateprofilelookup/${new ObjectID()}/${start}/${limit}/${showAll}${searchString !== '' ? '/' + searchString : ''}`,
            { headers: corsHeaders }).toPromise();
    }

    deleteProfile(
        id: string
    ): Promise<any> {

        let corsHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });

        return this.httpClient.delete(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/deletecandidateprofile/${new ObjectID()}/${id}`,
            { headers: corsHeaders }).toPromise();
    }

    undeleteProfile(
        id: string
    ): Promise<any> {

        let corsHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });

        return this.httpClient.delete(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/undeletecandidateprofile/${new ObjectID()}/${id}`,
            { headers: corsHeaders }).toPromise();
    }
}
