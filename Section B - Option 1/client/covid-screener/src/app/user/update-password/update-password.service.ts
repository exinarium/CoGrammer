import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import ObjectID from 'bson-objectid';
import { environment } from 'src/environments/environment';

@Injectable()
export class UpdatePasswordService {

    constructor(private httpClient: HttpClient) { }

    updatePassword(
        currentPassword,
        newPassword,
        confirmPassword
    ): Promise<any> {

        const corsHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });

        return this.httpClient.put(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/update-password`,
            {
                requestId: new ObjectID(),
                currentPassword,
                newPassword,
                confirmPassword
            },
            { headers: corsHeaders }).toPromise();
    }
}
