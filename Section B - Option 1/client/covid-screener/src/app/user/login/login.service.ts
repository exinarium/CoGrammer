import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import ObjectID from 'bson-objectid';
import { environment } from 'src/environments/environment';

@Injectable()
export class LoginService {

    constructor(private httpClient: HttpClient) { }

    login(email: string, password: string): Promise<any> {

        let corsHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });

        return this.httpClient.post(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/authentication`,
            { email, password, id: new ObjectID() },
            { headers: corsHeaders }).toPromise();
    }
}
