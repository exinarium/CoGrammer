import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import ObjectID from 'bson-objectid';
import { environment } from 'src/environments/environment';

@Injectable()
export class CandidateInteractionService {

    constructor(private httpClient: HttpClient) { }

    createInteraction(
        clientImage: any,
        meetingAddress: string,
        temperature: number,
        clientClassification: string,
        suspectedCovid19: boolean,
        symptomsCovid19: boolean,
        directContactCovid19: boolean,
        indirectContactCovid19: boolean,
        testedCovid19: boolean,
        travelledProvincially: boolean,
        travelledInternationally: boolean,
        autoImmuneDisease: boolean,
        additionalNotes: string,
        additionalGroupMembers: any[],
        confirmInformationCorrect: boolean,
        profileId: string
    ): Promise<any> {

        const corsHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });

        return this.httpClient.post(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/createcandidateinteraction/`,
            {
                requestId: new ObjectID(),
                clientImage,
                meetingAddress,
                temperature,
                clientClassification,
                suspectedCovid19,
                symptomsCovid19,
                directContactCovid19,
                indirectContactCovid19,
                testedCovid19,
                travelledProvincially,
                travelledInternationally,
                autoImmuneDisease,
                additionalNotes,
                additionalGroupMembers,
                confirmInformationCorrect,
                profileId
            },
            { headers: corsHeaders }).toPromise();
    }

    editInteraction(
        _id: string,
        clientImage: any,
        meetingAddress: string,
        temperature: number,
        clientClassification: string,
        suspectedCovid19: boolean,
        symptomsCovid19: boolean,
        directContactCovid19: boolean,
        indirectContactCovid19: boolean,
        testedCovid19: boolean,
        travelledProvincially: boolean,
        travelledInternationally: boolean,
        autoImmuneDisease: boolean,
        additionalNotes: string,
        additionalGroupMembers: any[],
        confirmInformationCorrect: boolean,
        version: number,
        profileId: string
    ): Promise<any> {

        const corsHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });

        return this.httpClient.put(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/updatecandidateinteraction/`,
            {
                requestId: new ObjectID(),
                _id,
                clientImage,
                meetingAddress,
                temperature,
                clientClassification,
                suspectedCovid19,
                symptomsCovid19,
                directContactCovid19,
                indirectContactCovid19,
                testedCovid19,
                travelledProvincially,
                travelledInternationally,
                autoImmuneDisease,
                additionalNotes,
                additionalGroupMembers,
                confirmInformationCorrect,
                version,
                profileId
            },
            { headers: corsHeaders }).toPromise();
    }

    lookupInteraction(
        id: string,
        profileId: string
    ): Promise<any> {

        const corsHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });

        return this.httpClient.get(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/candidateinteractionlookup/${new ObjectID()}/${profileId}/0/1/true/ /${id}`,
            { headers: corsHeaders }).toPromise();
    }

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
}
