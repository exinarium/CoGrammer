import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import ObjectID from 'bson-objectid';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserForgotPasswordService {

    constructor(private httpClient: HttpClient) { }

    forgotPassword(
        forgotPasswordCode,
        emailAddress,
        newPassword,
        confirmPassword
    ): Promise<any> {

        const corsHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });

        return this.httpClient.post(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/forgot-password`,
            {
                requestId: new ObjectID(),
                emailAddress,
                forgotPasswordCode,
                newPassword,
                confirmPassword
            },
            { headers: corsHeaders }).toPromise();
    }
}
