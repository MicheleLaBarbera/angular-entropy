import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/user/models/User';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent {
  public user!: User;

  constructor(private _router: Router) {
  }

  ngOnInit() {
    let currentUserData = JSON.parse(localStorage.getItem('currentUserData')!);

    if(!currentUserData)      
      this._router.navigate(['/users/auth']);
    
    this.user = currentUserData;
  }
}
