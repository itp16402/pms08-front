import {LoginService} from '../services/login.service';
import {environment} from '../../../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    // @ts-ignore
    const isApiUrl = request.url.startsWith(environment.menuPath);
    // @ts-ignore
    const loginUrl = request.url.startsWith(environment.menuPath + 'authenticate');
    if (token && isApiUrl && !loginUrl) {
      request = request.clone({
        setHeaders:
          {
            // Use of slice method in order to remove double quotes(") from token, which is an array of strings
            Authorization: 'Bearer ' + token.slice(1, -1)
          }
      });
    }

    return next.handle(request);
  }
}
