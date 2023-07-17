import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import { UserService } from 'src/app/user/services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
 
  constructor(private router: Router, private _userService: UserService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(!localStorage.getItem('currentUser')) {
      this.router.navigate(['/users/auth']);
      return false;
    }

    let currentUser = JSON.parse(localStorage.getItem('currentUser')!);

    if(!currentUser) {         
      this.router.navigate(['/users/auth']);
      return false;    
    }

    if(!currentUser.token) {
      this.router.navigate(['/users/logout']);
      return false;
    }

    let tokenPayload: any = jwt_decode(currentUser.token);
    let nowTimestamp = new Date().getTime() / 1000;       

    if(nowTimestamp >= tokenPayload.exp) {     
      this.router.navigate(['/users/logout']);
      return false;
    }
    return this._userService.getCurrentUser().pipe(
      map(response => {
        if(response.hasOwnProperty('error')) { 
          this.router.navigate(['/users/logout']);
          return false;
        }
        localStorage.removeItem('currentUserData');
        localStorage.setItem('currentUserData', JSON.stringify(response));
        return true;
      })
    );
  }
}