import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {FormRoleDtoModel} from '../../models/general-form-view-models/form-role-dto.model';
import {ParentDtoModel} from "../../models/phase/parent-dto.model";

@Injectable({
  providedIn: 'root'
})
export class FormRoleControllerService {

  baseUrl = environment.menuPath;

  constructor(private http: HttpClient) { }

  findFromRolesByMember(memberId: any, orderId: any): Observable<FormRoleDtoModel> {
    return this.http.get<FormRoleDtoModel>(this.baseUrl + 'form-roles/' + '/' + memberId + '/' + orderId);
  }

  checkIfMemberIsAssignedInForm(memberId: number, orderId: number, formListId: any): Observable<boolean> {
    return this.http.get<boolean>(this.baseUrl + 'form-roles/' + memberId + '/' + orderId + '/' + formListId);
  }

  changeFormStatus(memberId: number, orderId: number, formListId: any, formStatus: any, resource: any): Observable<FormRoleDtoModel> {
    return this.http.post<FormRoleDtoModel>(this.baseUrl + 'form-roles/' + memberId
      + '/' + orderId + '/' + formListId + '/' + formStatus, resource);
  }


  saveFormRoles(memberId: number, orderId: number, formListIds: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'form-roles/assign-work/' + memberId + '/' + orderId, formListIds);
  }

  // remove member access from a list
  removeFormRoles(memberId: number, orderId: number, formListIds: any[]): Observable<any> {
    // return this.http.delete<any[]>(this.baseUrl + ' form-roles/remove-work/' + memberMemberId + '/' + orderId, formListIds);
    return this.http.request('delete', this.baseUrl + 'form-roles/remove-work/' + memberId + '/' + orderId, {body: formListIds});
  }

  fetchFlowchartWithExistedMembers(memberId: number, lang: string, orderId: number): Observable<ParentDtoModel[]> {
    return this.http.get<ParentDtoModel[]>(this.baseUrl + 'form-roles/forms/' + memberId + '/' + lang + '/' + orderId);
  }
}
