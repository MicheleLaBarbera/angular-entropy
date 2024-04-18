import { Component, Host } from '@angular/core';
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
      navigator.clipboard.writeText(environment.endpointUrl + "classrooms/invite/" + invite_token).then(() => this._alertService.success("Invite link copied successfully"));;
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = environment.endpointUrl + "classrooms/invite/" + invite_token;
  
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
  }

  public downloadJson(){
    let classes = this.classrooms.map((classroom: Classroom) => {
      const date = new Date(classroom.created_at! * 1000);

      return {
        name: classroom.name,
        size: classroom.size,
        invite_token: classroom.invite_token,
        created_at: date.toLocaleDateString("en-GB", { 
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }) + " - " + String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0'),
        students_count: classroom.students_count,
        homeworks_count: classroom.homeworks_count
      }
    });

    let sJson = JSON.stringify(classes);
    let element = document.createElement('a');
    element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(sJson));
    element.setAttribute('download', 'exported_classes_' + Date.now() + '.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click(); 
    document.body.removeChild(element);
  }
}
