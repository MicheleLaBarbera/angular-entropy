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

  public getDateLabel(timestamp: number) {
    const date = new Date(timestamp * 1000);

    return date.toLocaleDateString("en-GB", { // you can use undefined as first argument
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }) + " - " + date.getHours() + ":" + date.getMinutes();
  }
}
