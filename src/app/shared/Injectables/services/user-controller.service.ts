import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {UserDtoModel} from '../../models/acceptance/member/user-dto.model';

@Injectable({
  providedIn: 'root'
})
export class UserControllerService {

  baseUrl = environment.menuPath;

  constructor(private http: HttpClient) { }

  // has the information of logged in user
  fetchUserByUsername(username: string): Observable<UserDtoModel> {
    return this.http.get<UserDtoModel>(this.baseUrl + 'users/' + username);
  }

  getAllUsers(username: string): Observable<UserDtoModel[]> {
    const currentUserName = username.slice(1, -1);
    return this.http.get<UserDtoModel[]>(this.baseUrl + 'users/all/' + currentUserName);
  }

  searchMemberByLastName(lastName: any, username: string): Observable<UserDtoModel[]> {
    const currentUserName = username.slice(1, -1);
    return this.http.get<UserDtoModel[]>(this.baseUrl + 'users/search/' + currentUserName + '/' + lastName);
  }
}
