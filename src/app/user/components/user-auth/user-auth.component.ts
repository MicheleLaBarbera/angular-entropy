import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { UserService } from '../../services/user.service';

import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styles: [
  ]
})
export class UserAuthComponent {
  public userAuthForm = this._fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
    remember_me: [''],
  }, {});

  constructor(private _fb: FormBuilder, private _userService: UserService, private _router: Router) { }

  public onSubmit() {
    this._userService.authUser(this.userAuthForm.value.username!, this.userAuthForm.value.password!, +this.userAuthForm.value.remember_me!).subscribe(response => {
      if(!response.hasOwnProperty('error')) {
        let tokenPayload: any = jwt_decode(response.access_token);

        localStorage.setItem('currentUser', JSON.stringify({ 
          username: tokenPayload.sub,
          token: response.access_token
        }));

        this._router.navigate(['/']);
      } 
    });
  }
}
