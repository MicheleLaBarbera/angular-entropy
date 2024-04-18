import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { AlertService } from 'src/app/shared/alert/alert.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styles: [
  ]
})
export class UserCreateComponent {
  public userCreateForm = this._fb.group({
    firstname: ['', [Validators.required, Validators.minLength(2)]],
    lastname: ['', [Validators.required, Validators.minLength(2)]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
    role: ['0', [Validators.required]],
  }, {});

  public loading: boolean;

  constructor(private _fb: FormBuilder, private _userService: UserService, private _router: Router, private _alertService: AlertService) { 
    this.loading = false;
  }

  public onSubmit() {
    let user: User = {
      firstname: this.userCreateForm.value.firstname!,
      lastname: this.userCreateForm.value.lastname!,
      username: this.userCreateForm.value.username!,
      email: this.userCreateForm.value.email!,
      password: this.userCreateForm.value.password!,
      role: parseInt(this.userCreateForm.value.role!)
    }
    this.loading = true;
    this._userService.createUser(user).subscribe(response => {
      if(!response.hasOwnProperty('error')) {
        this._alertService.success("You have created an account. Now proceed to sign in.")
        this._router.navigate(['/']);
      } 
      this.loading = false;
    });
  }
}
