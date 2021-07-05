import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  baseUrl = environment.mailPath;

  constructor(private http: HttpClient) {}

  sendMail(mailBody: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'mail', mailBody);
  }
}
