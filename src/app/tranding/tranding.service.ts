import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class TrandingService{
    url: string = "http://192.168.1.8/mediaApp-BackEnd/tranding";
    constructor(private http: HttpClient){}
    getContent(info): Observable<any>{
      return this.http.post(`${this.url}/getContent.php`, info);
    }
}