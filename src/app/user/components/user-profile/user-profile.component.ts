import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styles: [
  ]
})
export class UserProfileComponent {

  public userPatchForm = this._fb.group({
    firstname: ['', [Validators.required, Validators.minLength(2)]],
    lastname: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: [null, [Validators.minLength(8), Validators.maxLength(16)]],
  }, {});

  public user!: User;

  public loading: boolean;

  constructor(private _router: Router, private _fb: FormBuilder, private _userService: UserService, private _alertService: AlertService) {
    this.loading = false;
  }

  ngOnInit() {
    let currentUserData = JSON.parse(localStorage.getItem('currentUserData')!);

    if(!currentUserData)      
      this._router.navigate(['/users/auth']);
    
    this.user = currentUserData;

    this.userPatchForm.patchValue({
      firstname: this.user.firstname,
      lastname: this.user.lastname,
      email: this.user.email,
    });
  }

  public onSubmit() {
    this.loading = true;

    let user = {
      firstname: this.userPatchForm.value.firstname!,
      lastname: this.userPatchForm.value.lastname!,
      email: this.userPatchForm.value.email!,
      password: this.userPatchForm.value.password!,
    }
    this.loading = true;
    this._userService.patchUser(this.user._id!, user).subscribe(response => {
      if(!response.hasOwnProperty('error')) {
        this._alertService.success("You have updated your account.");

        this._userService.getCurrentUser().subscribe(user => {
          if(response.hasOwnProperty('error')) { 
            this._router.navigate(['/users/logout']);
          }
          localStorage.removeItem('currentUserData');
          localStorage.setItem('currentUserData', JSON.stringify(user));
        });
      }  
      this.loading = false;
    });
  }
}
