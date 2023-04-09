import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-logout',
  templateUrl: './user-logout.component.html',
  styles: [
  ]
})
export class UserLogoutComponent {
  constructor(private _router: Router) {
    if(localStorage.getItem('currentUser')) {
      let currentUser = JSON.parse(localStorage.getItem('currentUser')!);
      if(currentUser) {
        localStorage.removeItem('currentUser');
        this._router.navigate(['/users/auth']);
      }  
    }
    this._router.navigate(['/']);
  }
}
