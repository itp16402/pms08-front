import { Injectable } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResponseEntityModel} from '../../../models/response-entity.model';
import {FormStatusRequestDtoModel} from '../../../models/form-status-request-dto.model';

@Injectable({
  providedIn: 'root'
})
export class MemberStatusControllerService {

  baseUrl = environment.menuPath;

  constructor(private http: HttpClient) {
  }

  getStatus(orderId: any, formListId: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'form-lists/status/' + orderId + '/' + formListId);
  }

  saveStatus(orderId: any, formListId: any, status: FormStatusRequestDtoModel): Observable<ResponseEntityModel> {
    return this.http.post<ResponseEntityModel>(this.baseUrl + 'form-lists/status/' + formListId + '/' + orderId, status);
  }
}
