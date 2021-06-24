import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {LoginService} from '../services/login.service';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class ResponsePeelerInterceptorService implements HttpInterceptor {

  constructor(public toasterService: ToastrService, public loginService: LoginService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
// @ts-ignore
    return next.handle(req).pipe(
      tap(evt => {
        if (evt instanceof HttpResponse) {
          if (evt.status === 200 ) {
            this.toasterService.success('Νο Error Occurred', 'OK', {positionClass: 'toast-top-right'});
          } else if (evt.status === 201) {
            this.toasterService.success('Νο Error Occurred', 'OK', {positionClass: 'toast-top-right'});
          }
        }
      }),
      catchError((err: any) => {
        if(err instanceof HttpErrorResponse) {
          try {
            if (err.status === 0) {
              this.toasterService.error('An error occurred', '', {positionClass: 'toast-top-right'});
            } else if (err.status === 400){
              this.toasterService.error(err.error.status, err.error.errorCode, {positionClass: 'toast-top-right'});
            } else if (err.status === 401) {
              this.loginService.logout();
              window.location.reload();
              this.toasterService.error('Session Closed', 'Unauthorized', {positionClass: 'toast-top-right'});
            } else if (err.status === 403){
              this.toasterService.error(err.error.message, '403 Forbidden', {positionClass: 'toast-top-right'});
            } else if (err.status === 404 ) {
              this.toasterService.error(err.error.message, '404 Not Found', {positionClass: 'toast-top-right'});
            } else if (err.status === 406 ) {
              this.toasterService.error(err.error.status, err.error.errorCode, {positionClass: 'toast-top-right'});
            } else if (err.status === 409 ) {
              this.toasterService.error(err.error.status, err.error.errorCode, {positionClass: 'toast-top-right'});
            } else if (err.status === 421 ) {
              this.toasterService.error(err.error.status, err.error.errorCode, {positionClass: 'toast-top-right'});
            } else if (err.status === 500 ) {
              this.toasterService.error(err.error.message, '500 Internal Server Error', {positionClass: 'toast-top-right'});
            } else {
              this.toasterService.error(err.error.message, err.error.error, {positionClass: 'toast-top-right'});
            }

          } catch( e ) {
            this.toasterService.error('An error occurred', '', { positionClass: 'toast-top-right' });
          }
          // log error
        }
        return of(err);
      })
    );

  }
}
