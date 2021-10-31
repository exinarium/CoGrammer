import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import ObjectID from 'bson-objectid';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserListService {

    constructor(private httpClient: HttpClient) { }

    lookuplist(
        searchString: string = '',
        start: number = 0,
        limit: number = 0
    ): Promise<any> {

        let corsHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });

        return this.httpClient.get(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/userlookup/${new ObjectID()}/${start}/${limit}${searchString !== '' ? '/' + searchString : ''}`,
            { headers: corsHeaders }).toPromise();
    }

    deleteUser(
        id: string
    ): Promise<any> {

        let corsHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });

        return this.httpClient.delete(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/deleteuser/${new ObjectID()}/${id}`,
            { headers: corsHeaders }).toPromise();
    }

    undeleteUser(
        id: string
    ): Promise<any> {

        let corsHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });

        return this.httpClient.delete(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/undeleteuser/${new ObjectID()}/${id}`,
            { headers: corsHeaders }).toPromise();
    }
}
