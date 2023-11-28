import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/user/models/User';

@Component({
  selector: 'app-dashboard-student',
  templateUrl: './dashboard-student.component.html',
  styles: [
  ]
})
export class DashboardStudentComponent {
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
