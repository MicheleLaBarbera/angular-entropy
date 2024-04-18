import { Component, Input } from '@angular/core';
import { ClassroomHomeworkService } from '../../services/classroom-homework.service';
import { CLASSROOM_HOMEWORK_ACTION, ClassroomHomework } from '../../models/ClassroomHomework';
import { User } from 'src/app/user/models/User';
import { Router } from '@angular/router';
import { Classroom } from 'src/app/classroom/models/Classroom';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-classroom-homework-list',
  templateUrl: './classroom-homework-list.component.html',
  styles: [
  ]
})
export class ClassroomHomeworkListComponent {
  
  @Input() classroom!: Classroom;

  public loading: boolean;
  public homeworks: ClassroomHomework[];
  public user: User;

  constructor(private _classroomHomeworkService: ClassroomHomeworkService, private _router: Router, private _userService: UserService) {
    this.loading = false;
    this.homeworks = [];

    let currentUserData = JSON.parse(localStorage.getItem('currentUserData')!);

    if(!currentUserData)      
      this._router.navigate(['/users/auth']);
    
    this.user = currentUserData;

    this._classroomHomeworkService.updatedClassroomHomeworks$.subscribe(response => {
      if(response == CLASSROOM_HOMEWORK_ACTION.CREATE)
        this.getClassroomHomeworks();
    });

  }

  ngOnInit() {
    this.getClassroomHomeworks();
  }

  public getClassroomHomeworks() {
    this.loading = true;

    if(this.classroom) {
      this._classroomHomeworkService.getClassroomHomeworks(this.classroom._id?.$oid!).subscribe(response => {
        if(!response.hasOwnProperty('error')) {
          this.homeworks = <ClassroomHomework[]>response;

          if(this.homeworks)
            this.homeworks.sort((a, b) => (this.user.role == 0) ? a.expire_datetime - b.expire_datetime : b.expire_datetime - a.expire_datetime);
        }
        this.loading = false;
      });
    } else {
      this._userService.getCurrentUserHomeworks().subscribe(response => {
        if(!response.hasOwnProperty('error')) {
          this.homeworks = <ClassroomHomework[]>response;


          if(this.homeworks)
            this.homeworks.sort((a, b) => (this.user.role == 0) ? a.expire_datetime - b.expire_datetime : b.expire_datetime - a.expire_datetime);
        }
        this.loading = false;
      });
    }
  }

  public downloadJson(){
    let homeworks = this.homeworks.map((homework: ClassroomHomework) => {
      const startDate = new Date(homework.start_datetime! * 1000);
      const expireDate = new Date(homework.expire_datetime! * 1000);
      const createdDate = new Date(homework.created_at! * 1000);

      return {
        title: homework.title,
        body: homework.body,
        node_min: homework.node_min,
        node_max: homework.node_max,
        start_datetime: startDate.toLocaleDateString("en-GB", { 
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }) + " - " + String(startDate.getHours()).padStart(2, '0') + ":" + String(startDate.getMinutes()).padStart(2, '0'),
        expire_datetime: expireDate.toLocaleDateString("en-GB", { 
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }) + " - " + String(expireDate.getHours()).padStart(2, '0') + ":" + String(expireDate.getMinutes()).padStart(2, '0'),
        created_at: createdDate.toLocaleDateString("en-GB", { 
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }) + " - " + String(createdDate.getHours()).padStart(2, '0') + ":" + String(createdDate.getMinutes()).padStart(2, '0'),
      }
    });

    let sJson = JSON.stringify(homeworks);
    let element = document.createElement('a');
    element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(sJson));
    element.setAttribute('download', 'exported_homeworks_' + Date.now() + '.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click(); 
    document.body.removeChild(element);
  }
}
