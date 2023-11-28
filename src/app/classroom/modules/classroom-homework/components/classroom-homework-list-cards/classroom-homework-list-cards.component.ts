import { Component, Input } from '@angular/core';
import { CLASSROOM_HOMEWORK_ACTION, ClassroomHomework } from '../../models/ClassroomHomework';
import { User } from 'src/app/user/models/User';
import { ClassroomHomeworkService } from '../../services/classroom-homework.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-classroom-homework-list-cards',
  templateUrl: './classroom-homework-list-cards.component.html',
  styles: [
  ]
})
export class ClassroomHomeworkListCardsComponent {
  @Input() active: boolean;

  public loading: boolean;
  public homeworks: ClassroomHomework[];
  public user: User;

  constructor(private _classroomHomeworkService: ClassroomHomeworkService, private _router: Router, private _userService: UserService) {
    this.active = true;

    this.loading = false;
    this.homeworks = [];

    let currentUserData = JSON.parse(localStorage.getItem('currentUserData')!);

    if(!currentUserData)      
      this._router.navigate(['/users/auth']);
    
    this.user = currentUserData;
  }

  ngOnInit() {
    this.getClassroomHomeworks();
  }

  public getClassroomHomeworks() {
    this.loading = true;

    this._userService.getCurrentUserHomeworks(this.active).subscribe(response => {
      if(!response.hasOwnProperty('error')) {
        this.homeworks = <ClassroomHomework[]>response;

        this.homeworks.map((el: any) => { el.classroom_id = el.classroom_id.$oid })

        for(let homework of this.homeworks)
          console.log('classrooms/' + homework.classroom_id + '/homeworks/' + homework._id!.$oid);

        if(this.homeworks)
          this.homeworks.sort((a, b) => (this.user.role == 0) ? a.expire_datetime - b.expire_datetime : b.expire_datetime - a.expire_datetime);
      }
      this.loading = false;
    });
  }

  public getStatusLabel(status: number): string {
    return (!status) ? 'To-do' : 'Completed';
  }
}
