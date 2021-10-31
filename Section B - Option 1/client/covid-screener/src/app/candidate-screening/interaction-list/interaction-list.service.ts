import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import ObjectID from 'bson-objectid';
import { environment } from 'src/environments/environment';

@Injectable()
export class CandidateInteractionListService {

    constructor(private httpClient: HttpClient) { }

    lookuplist(
        profileId: string,
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

        return this.httpClient.get(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/candidateinteractionlookup/${new ObjectID()}/${profileId}/${start}/${limit}/${showAll}${searchString && searchString !== '' ? '/' + searchString : ''}`,
            { headers: corsHeaders }).toPromise();
    }

    deleteInteraction(
        id: string
    ): Promise<any> {

        let corsHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });

        return this.httpClient.delete(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/deletecandidateinteraction/${new ObjectID()}/${id}`,
            { headers: corsHeaders }).toPromise();
    }
}