import { Component } from '@angular/core';
import { CLASSROOM_ACTION, Classroom } from '../../models/Classroom';
import { ClassroomService } from '../../services/classroom.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { Router } from '@angular/router';
import { User } from 'src/app/user/models/User';

@Component({
  selector: 'app-classroom-list',
  templateUrl: './classroom-list.component.html',
  styles: [
  ]
})
export class ClassroomListComponent {
  public classrooms: Classroom[];
  public loading: boolean;
  public user: User;

  constructor(private _classroomService: ClassroomService, private _alertService: AlertService, private _router: Router) {
    this.classrooms = [];
    this.loading = false;

    let currentUserData = JSON.parse(localStorage.getItem('currentUserData')!);

    if(!currentUserData)      
      this._router.navigate(['/users/auth']);
    
    this.user = currentUserData;

    this._classroomService.updatedClassrooms$.subscribe(response => {
      if(response == CLASSROOM_ACTION.CREATE)
        this.getClassrooms();
    })
  }

  ngOnInit() {
    this.getClassrooms();
  }

  public getClassrooms() {
    this.loading = true;
    
    this._classroomService.getClassrooms().subscribe(response => {
      if(!response.hasOwnProperty('error')) {
        this.classrooms = <Classroom[]>response;

        this.classrooms.sort((a, b) => a.name.localeCompare(b.name));
      }
      this.loading = false;
    });
  }

  public copyLink(invite_token: string) {
    navigator.clipboard.writeText("http://localhost:4200/classrooms/invite/" + invite_token).then(() => this._alertService.success("Invite link copied successfully"));
  }
}
