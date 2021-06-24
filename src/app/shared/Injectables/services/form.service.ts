import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FormViewModel} from '../../models/general-form-view-models/form-view.model';
import {environment} from '../../../../environments/environment';
import {FormViewStatusDtoModel} from '../../models/general-form-view-models/form-view-status-dto.model';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  baseUrl = environment.menuPath;

  constructor(private http: HttpClient) { }

  /** Get form fields using the form type which is used only for the form a111 in
   *  order to change the data if user select the 'OTA' category
   */
  getFormViewModel(tableName: string, lang: string, formType: string): Observable<FormViewModel[]> {
    return this.http.get<FormViewModel[]>(this.baseUrl + 'form-views/form-type/' + tableName + '/' + lang  + '/' + formType);
  }
  /** Get form fields using the project id in order not to send the form type */
  findFormsByTableNameAndOrderId(tableName: string, lang: string, projectId: number): Observable<FormViewModel[]> {
    return this.http.get<FormViewModel[]>(this.baseUrl + 'form-views/order/' + tableName + '/' + lang  + '/' + projectId);
  }
  /** METHOD WHICH IS USED FOR STATUTORY SIDEBAR MENU */
  findFormsByNamesAndStatusByFlowchartChild(flowChartChildId: any, lang: string, typo: string, projectId: number)
    : Observable<FormViewStatusDtoModel[]> {
    return this.http.get<FormViewStatusDtoModel[]>(this.baseUrl + 'form-views/flowchart-child/' +
      flowChartChildId + '/' + lang + '/' + typo + '/' + projectId);
  }

  findAllTableNames(lang: any): Observable<FormViewModel[]> {
    return this.http.get<FormViewModel[]>(this.baseUrl + 'form-views/table-names/' + lang);
  }
}
