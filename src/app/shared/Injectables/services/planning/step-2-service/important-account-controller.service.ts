import { Injectable } from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ImportantAccountDto} from '../../../../models/planning/important-account-221/important-account-dto';
import {ResponseEntityModel} from '../../../../models/response-entity.model';

@Injectable({
  providedIn: 'root'
})
export class ImportantAccountControllerService {

  baseUrl = environment.menuPath;

  constructor(private http: HttpClient) { }

  fetchImportantAccountByOrderSamId(projectId: number, formListId: any): Observable<ImportantAccountDto> {
    return this.http.get<ImportantAccountDto>(this.baseUrl + 'important-accounts/order/' + projectId + '/' + formListId);
  }

  saveImportantAccount(projectId: number, formListId: any, resource: ImportantAccountDto): Observable<ResponseEntityModel> {
    return this.http.post<ResponseEntityModel>(this.baseUrl + 'important-accounts/' + projectId + '/' + formListId, resource);
  }
}
