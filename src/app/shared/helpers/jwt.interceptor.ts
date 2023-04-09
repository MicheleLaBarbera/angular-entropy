import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(localStorage.getItem('currentUser')) {
      let currentUser = JSON.parse(localStorage.getItem('currentUser')!);
      if (currentUser && currentUser.token) {                 
        let tokenPayload: any = jwt_decode(currentUser.token);
        let nowTimestamp = new Date().getTime() / 1000;
        if(nowTimestamp >= tokenPayload.exp) {
          this.router.navigate(['/users/logout']);
        }
        else {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${currentUser.token}`
            }
          });
        }
      }
    }
    return next.handle(request);
  }
}