import { Component } from '@angular/core';
import { CLASSROOM_ACTION, Classroom } from '../../models/Classroom';
import { ClassroomService } from '../../services/classroom.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { Router } from '@angular/router';
import { User } from 'src/app/user/models/User';
import { environment } from 'src/environments/environment';

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
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(environment.endpointUrl + "/classrooms/invite/" + invite_token).then(() => this._alertService.success("Invite link copied successfully"));;
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = environment.endpointUrl + "/classrooms/invite/" + invite_token;
  
      // Move the textarea outside the viewport to make it invisible
      textarea.style.position = 'absolute';
      textarea.style.left = '-99999999px';
  
      document.body.prepend(textarea);
  
      // highlight the content of the textarea element
      textarea.select();
  
      try {
        document.execCommand('copy');
        this._alertService.success("Invite link copied successfully");
      } catch (err) {
        console.log(err);
      } finally {
        textarea.remove();
      }
    }
    //navigator.clipboard.writeText(environment.endpointUrl + "classrooms/invite/" + invite_token).then(() => this._alertService.success("Invite link copied successfully"));
  }
}
