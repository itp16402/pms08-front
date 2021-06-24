import {Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BasicInfoDtoModel} from '../../../models/acceptance/basic-info/basic-info-dto.model';

@Injectable({
  providedIn: 'root'
})
export class BasicInfoControllerService {

  baseUrl = environment.menuPath;

  constructor(private http: HttpClient) {
  }

  getBasicOrder(projectId: number, formId: number): Observable<BasicInfoDtoModel> {
    return this.http.get<BasicInfoDtoModel>(this.baseUrl + 'basic-info/project/' + projectId + '/' + formId);
  }

  saveBasicInfoByProjectId(resource: any, projectId: number, formId: number): Observable<BasicInfoDtoModel> {
    return this.http.post<BasicInfoDtoModel>(this.baseUrl + 'basic-info/' + projectId + '/' + formId, resource);
  }
}
