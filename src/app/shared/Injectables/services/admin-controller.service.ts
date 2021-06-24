import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {FormViewModel} from "../../models/general-form-view-models/form-view.model";
import {ResponseEntityModel} from "../../models/response-entity.model";

@Injectable({
  providedIn: 'root'
})
export class AdminControllerService {

  baseUrl = environment.menuPath;

  constructor(private http: HttpClient) { }

  findFormNames(tableName: any, lang: any): Observable<FormViewModel[]> {
    return this.http.get<FormViewModel[]>(this.baseUrl + 'admin/form-names/' + tableName + '/' + lang);
  }

  saveFormNames(resource: FormViewModel): Observable<ResponseEntityModel> {
    return this.http.post<ResponseEntityModel>(this.baseUrl + 'admin/form-names', resource);
  }
}
