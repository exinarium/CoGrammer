import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import ObjectID from 'bson-objectid';
import { environment } from 'src/environments/environment';

@Injectable()
export class VerifyAccountService {

    constructor(private httpClient: HttpClient) { }

    verifyAccount(
        verifyCode,
        newPassword,
        confirmPassword
    ): Promise<any> {

        const corsHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });

        return this.httpClient.post(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/verify`,
            {
                requestId: new ObjectID(),
                verifyCode,
                newPassword,
                confirmPassword
            },
            { headers: corsHeaders }).toPromise();
    }
}
