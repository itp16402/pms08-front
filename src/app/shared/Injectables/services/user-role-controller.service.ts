import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MemberRoleResponseDtoModel} from '../../models/acceptance/member/member-role-response-dto.model';

@Injectable({
  providedIn: 'root'
})
export class UserRoleControllerService {

  baseUrl = environment.menuPath;

  constructor(private http: HttpClient) { }

  fetchMemberRolesByProjectId(projectId: number): Observable<MemberRoleResponseDtoModel[]> {
    return this.http.get<MemberRoleResponseDtoModel[]>(this.baseUrl + 'user-roles/' + projectId);
  }

  addMembers(projectId: number, resource: any[]): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'user-roles/' + projectId, resource);
  }

  assignAdmin(userId: number, projectId: number, resource: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'user-roles/assign-admin/' + userId + '/' + projectId, resource);
  }

  removeAdmin(userId: number, projectId: number): Observable<any> {
    return this.http.delete<any>(this.baseUrl + 'user-roles/remove/admin/' + userId + '/' + projectId);
  }

  removeMember(memberId: number, projectId: number): Observable<any> {
    return this.http.delete<any>(this.baseUrl + 'user-roles/remove/member/' + memberId + '/' + projectId);
  }
}
