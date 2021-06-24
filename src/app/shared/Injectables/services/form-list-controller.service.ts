import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FormListDtoModel} from '../../models/general-form-view-models/form-list-dto.model';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormListControllerService {

  baseUrl = environment.menuPath;

  constructor(private http: HttpClient) { }

  getAll(): Observable<FormListDtoModel[]> {
    return this.http.get<FormListDtoModel[]>(this.baseUrl + 'form-lists');
  }

  getFormByName(formName: string): Observable<FormListDtoModel> {
    return this.http.get<FormListDtoModel>(this.baseUrl + 'form-lists/' + formName);
  }
}
