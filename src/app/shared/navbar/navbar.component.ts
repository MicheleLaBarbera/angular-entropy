import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/user/models/User';
import { AlertService } from '../alert/alert.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent {
  public user!: User;

  constructor(private _router: Router, private _alertService: AlertService) {
  }

  ngOnInit() {
    let currentUserData = JSON.parse(localStorage.getItem('currentUserData')!);

    if(!currentUserData)      
      this._router.navigate(['/users/auth']);
    
    this.user = currentUserData;
  }

  public notImplemented() {
    this._alertService.error('Not implemented yet');
  }
}
