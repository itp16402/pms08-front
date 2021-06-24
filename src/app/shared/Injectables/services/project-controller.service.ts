import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProjectResponseDtoModel} from '../../models/project-response-dto.model';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectControllerService {

  baseUrl = environment.menuPath;

  constructor(private http: HttpClient) {
  }

  findProjectsByMemberUsername(username: string): Observable<ProjectResponseDtoModel[]> {
    const currentUserName = username.slice(1, -1);
    return this.http.get<ProjectResponseDtoModel[]>(this.baseUrl + 'projects/' + currentUserName);
  }

  getOrderByUserNameAndOrderId(username: string, projectId: any): Observable<ProjectResponseDtoModel> {
    const currentUserName = username.slice(1, -1);
    return this.http.get<ProjectResponseDtoModel>(this.baseUrl + 'projects/' + currentUserName + '/' + projectId);
  }

}
