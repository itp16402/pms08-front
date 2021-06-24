import {LoginUserModel} from '../../models/login-user.model';
import {environment} from '../../../../environments/environment';
import {JwtResponseModel} from '../../models/jwt-response.model';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private currentUserSubject: BehaviorSubject<LoginUserModel>;
  public currentUser: Observable<LoginUserModel>;
  authPath = environment.authPath;

  helper = new JwtHelperService();


  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<LoginUserModel>(JSON.parse(localStorage.getItem('currentUser') as string));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // Method for taking each user token and process corresponding his/her privileges
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // @ts-ignore
  public get isLoggedIn(): boolean {
    return !!this.getToken();
  }

  login(username: string, password: string): Observable<JwtResponseModel> {
    return this.http.post<JwtResponseModel>(this.authPath + 'authenticate', {username, password})
      .pipe(map((jwt: JwtResponseModel) => {
        localStorage.setItem('currentUser', JSON.stringify(jwt.username));
        localStorage.setItem('token', JSON.stringify(jwt.jwt));
        this.currentUserSubject.next(jwt);
        return jwt;
      }));
  }

  logout(): void {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.clear();
    this.router.navigate(['el/login']);
  }

  register(resource: any): Observable<any> {
    return this.http.post<any>(this.authPath + 'register', resource);
  }

}
