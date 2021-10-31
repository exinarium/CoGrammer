import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class DownloadExportFileService {

    constructor(private httpClient: HttpClient) { }

    download(fileName: string): Observable<any> {

        let corsHeaders = new HttpHeaders({
            'Content-Type': 'application/ms-excel',
            'Accept': 'application/ms-excel',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        });

        return this.httpClient.get(`${environment.protocol}://${environment.host}:${environment.port}/api/v1/excelintegration/${fileName}`,
         { responseType: 'blob', headers: corsHeaders });
    }
}