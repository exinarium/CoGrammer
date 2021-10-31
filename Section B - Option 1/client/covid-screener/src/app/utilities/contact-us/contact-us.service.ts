import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import ObjectID from 'bson-objectid';

@Injectable()
export class ContactUsService {

    constructor(private httpClient: HttpClient) { }

    async sendMessage(name: string, email: string, subject: string, message: string, recaptchaKey: string) : Promise<any> {

        const corsHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });

        return this.httpClient.post(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/email/`,
            {
                requestId: new ObjectID(),
                name: name,
                from: email,
                to: 'support@creativ360.com',
                subject: subject,
                message: message,
                recaptchaKey: recaptchaKey
            },
            { headers: corsHeaders }).toPromise();
    }
}